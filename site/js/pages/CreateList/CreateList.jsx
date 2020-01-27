import {
  Text, TextInput, Box, Button, FormField, Heading,
} from 'grommet';
import {
  Formik, Form, Field, FieldArray, ErrorMessage,
} from 'formik';
import _ from 'lodash';
import is from 'is';
import styled from 'styled-components';

import React, { Component } from 'react';
import betaStore from './createList.store';
import PageFrame from '../../views/PageFrame';
import siteStore from '../../store/site.store';

const Label = styled.label`
display: inline-block;
min-width: 10rem;
padding: 0.25rem;
`;

const Frame = styled.section`
max-width: 50rem;
`;
const FormSection = styled.section`
padding: 1rem;
margin-bottom: 1rem;
`;

const ErrorText = ({ children }) => <Text textAlign="center" color="accent-4">{children}</Text>;

export default class CreateList extends Component {
  constructor(props) {
    // const { match } = props;
    super(props);

    this.stream = betaStore(props);

    this.state = { ...this.stream.state, newWord: '' };

    this.changeNewWord = this.changeNewWord.bind(this);
  }

  componentWillUnmount() {
    if (this._sub) {
      this._sub.unsubscribe();
    }
  }

  componentDidMount() {
    this._sub = this.stream.subscribe(({ state }) => {
      this.setState(state);
    }, (err) => {
      console.log('create stream error: ', err);
    });
  }

  get suggestions() {
    if (this.state.newWord.length < 2) return [];
    const words = [];
    const regex = new RegExp(this.state.newWord, 'i');
    siteStore.my.words.forEach((w) => words.push(w.label));
    return _(words)
      .filter((w) => regex.test(w))
      .sortBy()
      .slice(0, 6)
      .value();
  }

  changeNewWord(e) {
    const word = _.get(e, 'target.value', e);
    if (is.string(word)) { this.setState({ newWord: word }); }
  }

  render() {
    return (
      <PageFrame>
        <Heading color="accent-3">Create List</Heading>
        <Text margin="medium"> Define a set of words you would like to learn</Text>
        <Frame>
          <Box pad="small" border={{ size: '3px', color: 'accent-1' }} round="large">
            <Formik
              initialValues={{ label: '', words: [] }}
              validateOnMount
              validateOnChange
              validate={(values) => {
                const errors = {};

                if (!values.label) {
                  errors.label = 'required';
                }
                if (values.words.length < 4) {
                  errors.words = 'a minimum of 4 words required';
                }
                console.log('validate:', errors, values);
                return errors;
              }}
              onSubmit={(values, { setSubmitting, resetForm }) => {
                siteStore.do.newList(values);
                this.stream.do.reset();
                setSubmitting(false);
                resetForm({ label: '', words: [] });
              }}
            >
              {({
                handleSubmit, handleChange, handleBlur, values, errors, resetForm,
              }) => (
                <Form>
                  <FormSection>
                    <FormField label="Name">
                      <Field as={TextInput} name="label" />
                    </FormField>
                    <ErrorMessage name="label" component={ErrorText} />
                  </FormSection>
                  <Box height="3px" background="accent-1" />
                  <Box align="center" pad="small">
                    <Text textAlign="center" weight="bold" level="3" alignSelf="stretch" color="accent-3">Words</Text>
                  </Box>
                  <FormSection>
                    <FieldArray
                      name="words"
                      render={(arrayHelpers) => (
                        <>
                          {values.words.length ? (
                            <Box pad="small" gap="small" elevation="small">
                              {values.words.map((word, index) => (
                                <div key={`${index}`}>
                                  <Field as={TextInput} name={`words.${index}`} />
                                </div>
                              ))}
                            </Box>
                          ) : ''}
                          <Box direction="row" pad="medium" gap="medium">
                            <Button
                              plain={false}
                              onClick={() => {
                                const word = _.trim(this.state.newWord);
                                if (!word) return;
                                if (!values.words.includes(word)) arrayHelpers.push(word);
                                this.setState({ newWord: '' });
                              }}
                            >
                              Add a Word
                            </Button>
                            <TextInput
                              value={this.state.newWord || ''}
                              suggestions={this.suggestions}
                              onSelect={({ suggestion }) => {
                                this.changeNewWord(suggestion);a
                              }}
                              onChange={this.changeNewWord}
                              flex={1}
                            />
                          </Box>
                        </>
                      )}
                    />
                    <ErrorMessage component={ErrorText} name="words" />
                    <Box alignContent="center" direction="column">
                      <Button alignSelf="center" plain={false} primary type="submit">Crete a List</Button>
                    </Box>
                  </FormSection>
                </Form>
              )}
            </Formik>
          </Box>
        </Frame>
      </PageFrame>
    );
  }
}
