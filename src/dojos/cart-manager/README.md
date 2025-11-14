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

## 🚨 The Business Problem

### Context: "The Black Friday Campaign is Blocked"

Imagine receiving this urgent message from your Product Manager or E-commerce Lead:

> **To:** Development Team
> **From:** Product Manager
> **Subject:** URGENT! Black Friday campaign blocked - losing money NOW
>
> Team, we have two critical problems, both caused by the cart management system (`CartManager`):
>
> **1. We're Losing Money RIGHT NOW:**
>
> Finance discovered that our discount system is broken. The bug in the code causes the **"First Purchase" discount (10%) to STACK with coupon codes**. A "Standard" user making their first purchase who uses the "TS_DOJO_20" coupon (20%) is getting 30% off instead of just 20%! This is costing us thousands of euros daily.
>
> **2. We're Blocked on Future Revenue (Black Friday):**
>
> Marketing wants to launch our most important campaign ever in two weeks. The new rules are:
> - **BF Rule 1:** For **Premium** users, a "Buy 3, Pay for 2" promotion on selected products.
> - **BF Rule 2:** For all other users, **Free Shipping** on all orders.
>
> **THE BLOCKER:**
>
> We tried adding the "Free Shipping" logic and the system went haywire: it started giving free shipping *AND* applying the "FREE_SHIPPING" coupon (double discounts!).
>
> It's clear that `CartManager` is a black box. We cannot risk modifying it without proper safeguards.

### Why the Current Implementation Blocks the Business

The `CartManager` class suffers from several architectural issues that prevent implementing new business requirements:

1. **Tangled Logic:** Discount calculation, shipping fees, and coupon application are all mixed together in a single method, making it impossible to modify one without affecting the others.

2. **Hidden Dependencies:** The class directly accesses external services (database, logging) and applies business rules in an unpredictable order, making behavior hard to test and verify.

3. **No Safety Net:** Zero test coverage means any change could break existing functionality in unexpected ways, as demonstrated by the current bug that's causing financial losses.

4. **Rigid Structure:** The God Class pattern makes it impossible to add new discount strategies or shipping rules without risking cascading failures.

### The Dojo Mission

Our goal today is not just to "clean up code" - it's to **unblock the Black Friday campaign** and **stop losing money**.

To achieve this, we need to:

1. **Fix the discount stacking bug** immediately (stop the financial bleeding)
2. **Create a test safety net** around the existing behavior
3. **Extract discount and shipping logic** into separate, testable components
4. **Enable the implementation** of Black Friday rules without fear of breaking existing functionality

**Success Criteria:** The code is ready to safely implement BF Rule 1 (Buy 3, Pay for 2) and BF Rule 2 (Free Shipping) without breaking existing customer experiences or creating new financial losses.

The refactoring and testing work are not the end goal - they are the *necessary means* to deliver business value and unlock revenue opportunities.

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