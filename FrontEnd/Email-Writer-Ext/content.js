// the java scriot file that helps inject button into gmail screen and interface helps make api calls to backend
console.log("Email Writer Extension - Content loaded");

function createAIButton() {
    const button = document.createElement('div');
    button.className = 'T-I J-J5-Ji aoO v7 T-I-atl L3'; // copy the classes for the org send button in gmail
    button.style.marginRight = '8px';
    button.innerHTML = 'AI Reply'; // name of button on ui (what user sees)
    button.setAttribute('role', 'button');
    button.setAttribute('data-tooltip', 'Generate AI Reply');
    return button;
}

function getEmailContent() {
    const selectors = [
        '.h7',
        '.a3s.aiL',
        '.gnail_quote',
        '.gmail',
        '[role="presentation"]'
    ];
    for (const selector of selectors) {
        const content = document.querySelector(selector);
        if (content) {return content.innerText.trim();}
        return '';
    }
}
function findComposeToolBar() {
    const selectors = [
        '.btC',
        '.aDh',
        '[role="toolbar"]',
        '.gU.Up'
    ];
    for (const selector of selectors) {
        const toolbar = document.querySelector(selector);
        if (toolbar) {return toolbar;}
        return null;
    }
}

function injectButton() {
    const existingButton = document.querySelector('.ai-reply-button');
    if (existingButton) existingButton.remove();
    
    const toolBar = findComposeToolBar();
    if (!toolBar) {
        console.log("Toolbar not found");
        return;
    }
    console.log("Toolbar found, creating AI button");
    const button = createAIButton();
    button.classList.add('ai-reply-button');
    button.addEventListener('click', async () => {
        try {
            button.innerHTML = 'Generating...';
            button.disabled = true;

            const emailContent = getEmailContent(); 
            const response = await fetch('http://localhost:8080/api/email/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    emailContent: emailContent,
                    tone: "professional"
                })
            });
            if (!response.ok) {throw new Error('API Request Failed');}
            const generatedReply = await response.text();
            const composeBox = document.querySelector('[role="textbox"][g_editable="true"]');
            if (composeBox) {
                composeBox.focus();
                document.execCommand('insertText', false, generatedReply); // insert the text into the compose box 
            } else {
                console.error('Compose box was not found');
            }
        } catch (error) {
            console.error(error);
            alert('Failed to generate reply');
        } finally {
            button.innerHTML = 'AI Reply';
            button.disabled = false;
        }
    });
    toolBar.insertBefore(button, toolBar.firstChild);
}

const observer = new MutationObserver((mutations) => { // see if composed button is being added to the ui
    for (const mutation of mutations) {
        const addedNodes = Array.from(mutation.addedNodes);
        const hasComposedElements = addedNodes.some(node => //check if any of the nodes in the arry meet the condition below
            node.nodeType === Node.ELEMENT_NODE && 
            (node.matches('.aDh, .btC, [role="dialog"]') || node.querySelector('.aDh, .btC, [role="dialog"]'))
        );
        
        if(hasComposedElements) {
            console.log("Compose Window detected");
            setTimeout(injectButton, 500); // add delay of half a second
        }
    }
});

observer.observe(document.body, {
    childList: true, // look at child and subtrees
    subtree: true
});