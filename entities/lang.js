class Lang {
    //TEMP
    static TYPES = [
        'english',
        'deutsch',
        'polish',
        'franch',
        'spanish'
    ];

    //TODO
    static LEVELS = [
        
    ];

    constructor(attributes) {
        const {
            id,
            name
        } = Object.assign({}, {
            id: "0",
            name: "USER",
        }, attributes);
        this.id = id;
        this.name = name;
    };
};

export default Lang;