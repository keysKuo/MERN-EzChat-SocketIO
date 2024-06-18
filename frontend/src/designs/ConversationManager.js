class ConversationManager {
	constructor() {
		this.sortedConversations = [];
		this.conversations = {};
	}

	setup(conversations) {
        this.conversations = {};
        this.sortedConversations = [];
        
		conversations.forEach((conv) => {
			this.conversations[conv._id] = conv;
            this.sortedConversations.push(conv);
		});
	}

    update(convId, newMessage) {
        // Create temp conversation to save new message
        const tempConversation = this.conversations[convId];
        tempConversation.messages.push(newMessage);
        tempConversation.updatedAt = newMessage.updatedAt; 

        // Del outdated conversation
        delete this.conversations[convId]
        this.sortedConversations = Object.values(this.conversations);
        
        // Updated new conversation
        this.conversations[convId] = tempConversation;
        this.sortedConversations.unshift(tempConversation);   
    }

	sort() {
		this.sortedConversations.sort(
			(a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
		);
	}

    getConversations() {
        return this.sortedConversations;
    }
}

export default ConversationManager;