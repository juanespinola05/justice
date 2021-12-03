class TicketCategory {
    constructor(options) {
        this.title = options.title;
        this.description = options.desc;
        this.channel_id = options.channel_id;
        this.container_id = options.container_id;
        this.color = options.color;
    }
}

module.exports = TicketCategory;