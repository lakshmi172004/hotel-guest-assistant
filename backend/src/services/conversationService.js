const conversations = new Map();

function createConversation(conversationId) {

    if (!conversations.has(conversationId)) {

        conversations.set(conversationId, {
            checkIn: "",
            checkOut: "",
            adults: ""
        });

    }

    return conversations.get(conversationId);
}

function updateConversation(conversationId, details) {

    const conversation = createConversation(conversationId);

    if (details.checkIn) {
        conversation.checkIn = details.checkIn;
    }

    if (details.checkOut) {
        conversation.checkOut = details.checkOut;
    }

    if (details.adults) {
        conversation.adults = details.adults;
    }

    return conversation;
}

function getConversation(conversationId) {

    return createConversation(conversationId);

}

module.exports = {
    createConversation,
    updateConversation,
    getConversation
};