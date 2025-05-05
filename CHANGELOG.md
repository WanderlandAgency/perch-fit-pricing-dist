# CHANGELOG

# UPDATE V2.3.4 (April 18, 2025)
Fixed tier card selection to ensure only the selected plan (Professional by default) is highlighted
Improved custom pricing tag display by changing from display: block to display: flex for better layout
Added null checks for DOM elements to prevent console errors
Fixed FAQ script error that was causing console issues

## Key code changes:
Modified highlightPlanCard function to properly handle tier card selection:
function highlightPlanCard(planCardWrapper) {
  // First, reset all selection tags on all plan cards
  planCardWrappers.forEach((wrapper) => {
    // Find the selection tag in this wrapper
    const selectTag = wrapper.querySelector('.pricing_tier_select_tag');
    if (selectTag) {
      // Remove both highlight and active classes
      selectTag.classList.remove(HIGHLIGHT_CLASS, ACTIVE_CLASS);
    }
    
    // Also reset other elements that might have highlight classes
    wrapper.querySelectorAll('.pricing_tier_top, .pricing_tier_middle, .pricing_tier_bottom').forEach(element => {
      element.classList.remove(HIGHLIGHT_CLASS, ACTIVE_CLASS);
    });
  });

  // Now highlight only the selected plan card's selection tag
  const selectedSelectTag = planCardWrapper.querySelector('.pricing_tier_select_tag');
  if (selectedSelectTag) {
    // Add both highlight and active classes to the selected card's tag
    selectedSelectTag.classList.add(HIGHLIGHT_CLASS, ACTIVE_CLASS);
  }
  
  // Also highlight other elements in the selected card if needed
  planCardWrapper.querySelectorAll('.pricing_tier_top, .pricing_tier_middle, .pricing_tier_bottom').forEach(element => {
    element.classList.add(HIGHLIGHT_CLASS, ACTIVE_CLASS);
  });
}

#### Updated custom pricing tag display in the showError function:
function showError(type) {
  costSummaryWraps.forEach((wrap) => (wrap.style.display = "none"));
  customPricingTags.forEach((element) => {
    element.style.display = "flex"; // Changed from "block" to "flex"
  });
  // Rest of the function remains the same
}

#### Added null checks for DOM elements throughout the code
Added fix for FAQ script error:
document.addEventListener("DOMContentLoaded", () => {
  // Get all FAQ containers
  const faqContainers = document.querySelectorAll('.faq_wrap');
  if (faqContainers.length === 0) return; // Exit if no FAQ containers
  
  faqContainers.forEach(faqContainer => {
    const faqItems = faqContainer.querySelectorAll('.faq_item');
    if (faqItems.length > 0) {
      let firstFaqItem = faqItems[0];
      const radioButton = firstFaqItem.querySelector('input[type="radio"]');
      if (radioButton) {
        radioButton.checked = true;
      }
    }
  });
});

# UPDATE V2.3 (April 12, 2025)

Removed tab structure dependency
Modified UI to display only Hardware as a Service (HaaS) option
Removed Upfront Purchase option from UI as per client request
Preserved all existing calculation rules and business logic
Maintained custom pricing tooltips for different scenarios

## Key code changes:
Removed tab menu references and event listeners
Modified updatePricing() function to only display HaaS pricing
Updated hidePricing() function to align with new structure
Maintained internal calculations for both pricing options to preserve business rules

# UPDATE V2.2
# Patch active label for hardware item selection

#### To set active class when button is selected in hardwareToggleButtons forEach loop
```js
let hardwareNameWrapper = hardwareItem.querySelector(".c-toggle__text");
button.checked
  ? hardwareNameWrapper.classList.add("cc-active")
  : hardwareNameWrapper.classList.remove("cc-active");
```

# UPDATE V2.1
# Adding possibility to disable or enable next/submit depending on select input values

Because the initial version of the script doesn't take into account the "required" attribute of country and state select.

## Initiate new consts and functions

#### To store the default value of all input select
```js
const SELECTION_NULL = "selection-null";
```

#### To store the DOM element of the "use-perch" select input at the last step
```js
const perchUseSelect = getElement(section1, select("use-select"));
```

#### To set default value of us State to Alabama
```js 
usStateSelect.value = "Alabama";
```

#### To set default state of submit button to disable
```js
disableSubmitButton();
```

#### To change states of next and submit buttons
```js
function disableNextButton(step) {
  let nextButton = document.querySelectorAll('button[data-form="next-btn"]')[step];
  nextButton.style.pointerEvents = "none";
  nextButton.style.opacity = "0.5";
  nextButton.classList.add("disabled");
}
```
```js
function enableNextButton(step) {
  let nextButton = document.querySelectorAll('button[data-form="next-btn"]')[step];
  nextButton.style.pointerEvents = "auto";
  nextButton.style.opacity = "1";
  nextButton.classList.remove("disabled");
}
```
```js
function disableSubmitButton(){
  let submitButton = document.querySelector('[data-submit="true"]');
  submitButton.style.pointerEvents = "none";
  submitButton.style.opacity = "0.5";
  submitButton.classList.add("disabled");
}
```
```js
function enableSubmitButton(){
  let submitButton = document.querySelector('[data-submit="true"]');
  submitButton.style.pointerEvents = "auto";
  submitButton.style.opacity = "1";
  submitButton.classList.remove("disabled");
}
```

## Updated events listeners

#### Of country select
```js
countrySelect.addEventListener("change", () => {
  countrySelect.value === DEFAULT_COUNTRY
    ? (usStateSelect.style.display = "block")
    : (usStateSelect.style.display = "none");

  /// NEW
  if (countrySelect.value == SELECTION_NULL) {
    disableNextButton(1);
  }
  else if (countrySelect.value === DEFAULT_COUNTRY && usStateSelect.value == SELECTION_NULL) {
    disableNextButton(1);
  }
  else {
    enableNextButton(1);
  }
  /// NEW
});
```

#### Added event listener to US State select
```js
usStateSelect.addEventListener("change", () => {
  if (countrySelect.value === DEFAULT_COUNTRY && usStateSelect.value == SELECTION_NULL) {
    disableNextButton(1);
  }
  else if (countrySelect.value === DEFAULT_COUNTRY && usStateSelect.value != SELECTION_NULL) {
    enableNextButton(1);
  }
});
```
#### Added event listener to Perch use select
```js
perchUseSelect.addEventListener("change", () => {
  if (perchUseSelect.value === SELECTION_NULL){
    disableSubmitButton(1);
  }
  else{
    enableSubmitButton(1);
  }
});
```

# UPDATE V2
# Erased useless const and functions

Because the update on the webflow project involved the use of a grid system instead of webflow's tab to display pricing results. All functions and const based on this system has been erased.

## The script is available under two format
- #### perch-pricing.v2.js
Which contain the non minified/obfuscated but commented code to help future works on it if necessary. 
- #### perch-pricing.v2.min.js
Which contain the publishable code that has been minified and obfuscated. The one to publish on jsdelivr so.

#### grand-total-cost attribute died giving birth to
- grand-total-cost-haas
- grand-total-cost-cash

#### Erased :
```js
const grandTotalCost = section2.querySelector(select("grand-total-cost"));
```
```js
const customPricingTooltipQuantity = section2.querySelector(select("custom-pricing-tooltip-quantity"));
const customPricingTooltipPlan = section2.querySelector(select("custom-pricing-tooltip-plan"));
```
```js
function getActiveTab(element) {
  let activeTab = getElements(element, "[data-w-tab]").find(tab => tab.classList.contains("w--current"));
  return activeTab ? activeTab.getAttribute("data-w-tab").trim() : "";
}
```
```js
function getActiveTabName(element) {
  return getActiveTab(element).toLowerCase();
}
```

## Initiate new const and functions
Created new functions to match new grid-system

#### To store the total cost of upfront payment
```js
const cashTotalCost = section2.querySelector(select("grand-total-cost-cash"));
```

#### To store the total cost of haas pricing
```js
const haasTotalCost = section2.querySelector(select("grand-total-cost-haas"));
```

#### To store all tooltips element about quantity error and hiding it when page finish loading
```js
const customPricingTooltipsQuantity = document.querySelectorAll('[pp="custom-pricing-tooltip-quantity"]');
customPricingTooltipsQuantity.forEach(element=>{element.style.display = "none"});
```

#### To store all tooltips element about plan error
```js
const customPricingTooltipsPlan = document.querySelectorAll('[pp="custom-pricing-tooltip-plan"');
```

#### To hide the pricing text because the standar plan is not selected by default. Function called when form has been submited
```js
function hidePricing(){
  cashUpfrontCost.innerText = "";
  cashRecurringAnnualCost.innerText = "";
  cashYear1Total.innerText = "";
  cashTotalCost.innerText = "";
  haasRecurringAnnualCost.innerText = "";
  haasTotalCost.innerText = "";
}
```

#### Function to scroll to the pricing grid. Function called in selectedPlan click trigger
```js
function scrollToPricing()
{
  let element = document.getElementById("quote");
  element.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
```

## Updated "updatePricing()" function


#### Erased 
```js
let grandTotal = activeTab === "haas" ? totalHaas : totalCash;

if (grandTotal > 15000) {
  showError("quantity");
  return;
}
```
```js
grandTotalCost.innerText = formatCurrency(grandTotal);
```

#### To update the pricing text inside of pricing tabs
```js
cashTotalCost.innerText = formatCurrency(softwareCost + hardwarePriceCash);
haasTotalCost.innerText = formatCurrency(softwareCost + hardwarePriceHaas);
```
