const path = require('path');
const fs = require('fs');
const TicketCategory = require('./TicketCategory');
const ticketManagerMethods = require('../utils/ticketManager');

class ticketManager {
    constructor() {
        this.categories = [];
        this.tickets = [];
    }
    
    _initManager() {
        const categories = fs.existsSync(path.join(__dirname, "..", "data", "ticketCategories.json")) ?
        require("../data/ticketCategories.json") : [];
        
        this.categories = categories.map(c => {
            return new TicketCategory(c)
        });
        
        this.tickets = fs.existsSync(path.join(__dirname , "..", "data", "tickets.json")) ?
        require("../data/tickets.json") : [];
    }

}

for(let i = 0; i < ticketManagerMethods.length; i++) {
    ticketManager.prototype[ticketManagerMethods[i].name] = function(args) {
        ticketManagerMethods[i].run.apply(this,[...args]);
    }
}

module.exports = ticketManager;