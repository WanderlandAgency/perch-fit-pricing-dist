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
