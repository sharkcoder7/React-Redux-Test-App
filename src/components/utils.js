export function addOnLeavingPrompt(message) {
    window.onbeforeunload = function() {
        return 'Changes that you made may not be saved.';
    };
}

export function removeOnLeavingPrompt() {
    window.onbeforeunload = function() {
        return;
    };
}
