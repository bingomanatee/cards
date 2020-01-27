# WordQuiz

WordQuiz uses a set of word lists to review
vocabulary. you can play each list in arbitrary
order, and if stuck, you can see the definition by clicking the 
"reveal"  icon in the lower right.

## Technology

### Looking Glass Engine

WordQuiz leans on the [Looking Glass Engine](http://looking-glass-engine.now.sh)
to provide state management. This is a RXJS-based state system
with methods attached to a BehaviorSubject.

## Merriam-webster API

This app refers to the Merriam Webster public dictionary api to look up 
definitions for words. Note, display is bad when the api fails to return a 
proper definition. 

### Grommet

WordQuiz uses Grommet for most UI tasks. Grommet uses themes 
and FlexBox/Grid elements to control layout. 

### Propper

[Propper](https://github.com/bingomanatee/propper)
 adds typed properties to classes.

### Parcel

[Parcel](https://parceljs.org/) is a dedicated web/react SPA compiler that applies  
Babel and static hosting over a single page application. 

### Formik

Formik controls state for form entry scenarios to easily manage the interactions
and error messages for a web / react form. 

### Other utilities

Most of them speak for themselves:

* Lodash
* Is, a type validator
* axios
* chroma-js a color parser
* styled-components

## Deploying/running code

WordQuiz is a single page application. It requires node 13.x to be installed,
and runs best using yarn. To run locally, please execute

```bash
yarn
yarn dev
```

or

```bash
npm i
npm run dev
```

which should enable a local server at http://localhost:1234. 

The application is installed an running on 

https://word-quizzer.firebaseapp.com/

## Tested Environments

The application  has been tested on Chrome and Firefox on the Mac/OSx Catalina.
