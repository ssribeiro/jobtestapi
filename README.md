# APIJOBTEST API
Api developed according instructions as thecnical job test.

# Design Aspects

I looked for a framework style that could accomplish good scalability.
Tried to keep loose coupling and good reusability.

## Modules

I keep all modules with all state variables together on a **state** object. This way is easy to keep track of states during **phases** of execution.
Almost all the modules has **config**, **start** and **stop** functions, that does control the states.
Also they expose their **functionality** as **functions**.

## Test

All tests in **spec** files along with homonymous tested file. Additional **e2eSpecs** folder created for end-to-end tests (the ones concerning supertest).

## Error, Logger

They are all encapsulated in an way that is easy to upgrade and change.
I find the **error** tool very useful because it has shortcuts that allows take care of the errors easily

## Docker

Of course included with the instance of mongodb configured for dev..

## Further works
I dealed with some pretty ordinary troubles when setting up mocha. As I always used jasmine, even for backend, I found some issues but could overcome they all. Along with other **diabolic** time comsuming bugs.. :) but many because of a little rust also..

Excuses aside, I sacrificed many usefull **e2eSpecs** because I tried to accomplish the requirements faster as I could. I will write many further tests cases tomorrow. Of course you can keep track of this final version by the first commit that included this README.md

# JOBTEST PDF QUESTIONS


##  What are the benefits of developing code using Typescript and not simply with Javascript?

In a single word? **robustness** !
I thinks it is the most important benefit. It is amazing this power of the types. They make easy for someone to use your libraries and modules without having to even read the documentation, in some cases. That is because the types almost guide the programming itself.

You can also share interfaces between multiple services and between back and front end. It is almost like if you are carring the documentation inside the code itself. The type inference and IntelliSense are amazing. 

The Static typing grant security when programing and avoid many errors. In frontend it helps you to deal with browser compatibility allowing the transpile to multiple javascript versions.

Those are the ones I found most important.

## Do you think that Typescript is going to replace Javascript, is it a new programming language?

I do not think so.
I think typescript has capability for evolve as it own and become a new language detached from javascript eventually. However javascript itself is evolving too and is becaming more and more type-friendly.
I think most chances are that javascript embrace types in a way that will be good as (or better?) typescript.
This is really hard to guess.

# Aditional Packages
- chalk: to colorize terminal output,
- request: request-promise-native package dependency not installed (I should report it)
- sinon, sinon-chai, chai-things, chai-like: aditional useful testing libraries
- @types: a lot, of course
