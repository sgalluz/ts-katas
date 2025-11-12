# Cart Manager - Testing and Refactoring Legacy Code

## Overview

This dojo focuses on practicing **legacy code refactoring techniques** in TypeScript using a realistic e-commerce cart
management system. The `CartManager` class represents a typical "God Class" with multiple responsibilities, tight
coupling, and no test coverage - a common scenario in real-world legacy codebases.

### Structure

The dojo is structured as a hands-on workshop designed to be completed in approximately **3 hours**:

- **Phase 1**: Test Coverage (45 minutes) - Building a safety net
- **Phase 2**: Protected Refactoring (1 hour) - Systematic code improvement
- **Phase 3**: Discussion and Retrospective (1 hour) - Knowledge consolidation

### Focus Areas & Techniques

This kata emphasizes practical techniques for working with untested legacy code:

- **Incremental Test Coverage**: Using characterization tests and approval testing methods to capture existing behavior
- **Test Harness Creation**: Isolating difficult dependencies through spies and stubs to make the code testable
- **Safe Refactoring**: Applying Extract Method, Extract Class, and Introduce Parameter Object patterns
- **Small Steps Strategy**: Making tiny, verifiable changes with continuous test feedback
- **TypeScript Leverage**: Using the type system as a compile-time safety net during refactoring

### Learning Objectives

Participants will learn to:

1. Create a safety net of tests around untested legacy code without breaking existing functionality
2. Apply systematic refactoring techniques to separate responsibilities and reduce coupling
3. Use code coverage metrics to guide testing efforts and track progress
4. Identify and address common code smells (Large Class, Feature Envy, God Object)
5. Practice Pair/Mob Programming techniques for collaborative refactoring
6. Build confidence in refactoring legacy code through incremental, test-protected changes

### Prerequisites

- TypeScript development environment
- Testing framework (Jest) configured with code coverage support
- Basic understanding of refactoring principles and test-driven development

### Useful snippets

- Run tests with "watch mode" enabled:
    ```bash
        jest src/dojos/cart-manager --watch
    ```
- Run tests with coverage report:
  ```bash
    jest src/dojos/cart-manager --coverage
  ```

------------------------------------------------

## 🏗️ Implementation: Testing and Refactoring (1 hour and 45 minutes)

### Phase 1: Test Coverage (45 minutes)

* Objective: Achieve sufficient test coverage for a critical section of the class.
* Micro-steps:
    1. Isolation: Wrap the class in a Test Harness or temporarily isolate difficult dependencies (via
       spies or rudimentary stubs) to be able to instantiate it.
    2. Characterization Testing: Write the first test that exercises a functionality. This test must fail if the
       class behavior is modified. The focus is on external behavior, not internal
       implementation.
    3. Monitoring: With each small test added, verify that Code Coverage increases.
    4. Pair/Mob Programming: Working in pairs (Pair Programming) or in groups (Mob Programming) is fundamental for
       sharing the logic and maintaining focus on small steps.

### Phase 2: Protected Refactoring (1 hour)

* Objective: Apply the first refactorings with the help of the tests just written.
* Micro-steps:
    1. "Red-Green-Refactor" (RGR) on Legacy Code: After covering a section with tests (Green), begin the Refactor.
    2. Basic Techniques: Apply basic refactoring techniques for "separation of responsibilities":
        * Extract Method (if the method is too long).
        * Extract Class (to move extraneous responsibilities into a new class).
        * Introduce Parameter Object (to simplify method signatures with too many parameters).
    3. Safety: After each small refactoring, run the tests. If they fail, the refactoring was wrong.
       Undo and try a smaller step.
    4. TypeScript Leverage: Take advantage of TypeScript's type system; every refactoring that alters a function
       signature and is immediately caught by the TS compiler is a "free" test and a safety signal.

------------------------------------------------

## 💬 Discussion and Retrospective (1 hour)

* What We Learned (20 min):
    * How long did it take to reach the first 50% coverage?
    * What were the dependencies or entry points most difficult to test?
    * Which refactoring techniques proved most useful?
* Patterns and Obstacles (20 min):
    * What new names did we give to methods/classes? Has the semantics improved?
    * Discuss the "code smells" encountered (e.g. Large Class, Feature Envy, God Object).
    * How TypeScript's type system helped (or hindered) the process.
* Next Steps (20 min):
    * How can we apply the "small steps strategy" in our daily production code?
    * Identify the next area of legacy code in the real project that could benefit from this approach.