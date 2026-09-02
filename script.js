const inputText = document.getElementById("inputText");
const outputText = document.getElementById("outputText");

const sourceLanguage = document.getElementById("sourceLanguage");
const targetLanguage = document.getElementById("targetLanguage");

const translateButton = document.getElementById("translateButton");
const copyButton = document.getElementById("copyButton");
const clearButton = document.getElementById("clearButton");

const swapButton = document.getElementById("swapButton");

const charCount = document.getElementById("charCount");
const statusMessage = document.getElementById("statusMessage");


/* Character Counter */

inputText.addEventListener("input", function () {

    charCount.textContent = inputText.value.length;

});


/* Translation */

translateButton.addEventListener("click", async function () {

    const text = inputText.value.trim();

    const source = sourceLanguage.value;
    const target = targetLanguage.value;

    if (text === "") {

        statusMessage.textContent = "Please enter some text first.";
        return;

    }

    if (source === target) {

        outputText.textContent = text;
        statusMessage.textContent = "Source and target languages are the same.";
        return;

    }

    statusMessage.textContent = "Translating...";
    outputText.textContent = "Please wait...";

    try {

        const url =
            `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${source}|${target}`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Translation request failed.");
        }

        const data = await response.json();

        if (
            data.responseStatus !== 200 ||
            !data.responseData ||
            !data.responseData.translatedText
        ) {
            throw new Error("Translation unavailable.");
        }

        outputText.textContent =
            data.responseData.translatedText;

        statusMessage.textContent = "Translation completed successfully.";

    } catch (error) {

        outputText.textContent =
            "Sorry, translation could not be completed.";

        statusMessage.textContent =
            "Please check your internet connection and try again.";

        console.error(error);

    }

});


/* Copy Translation */

copyButton.addEventListener("click", async function () {

    const translatedText = outputText.textContent;

    if (
        !translatedText ||
        translatedText === "Your translation will appear here..."
    ) {
        statusMessage.textContent = "Nothing to copy.";
        return;
    }

    try {

        await navigator.clipboard.writeText(translatedText);

        statusMessage.textContent = "Translation copied!";

    } catch (error) {

        statusMessage.textContent =
            "Unable to copy the translation.";

    }

});


/* Clear */

clearButton.addEventListener("click", function () {

    inputText.value = "";

    outputText.textContent =
        "Your translation will appear here...";

    charCount.textContent = "0";

    statusMessage.textContent = "";

});


/* Swap Languages */

swapButton.addEventListener("click", function () {

    const currentSource = sourceLanguage.value;
    const currentTarget = targetLanguage.value;

    sourceLanguage.value = currentTarget;
    targetLanguage.value = currentSource;

    const currentInput = inputText.value;

    if (currentInput !== "") {

        inputText.value = outputText.textContent;

        outputText.textContent = currentInput;

    }

});
