export default{
    async replace(string) {
        let replaced = string;
        while(replaced.includes('{{') || replaced.includes('}}')){
            let entity = replaced.substring(replaced.indexOf('{{')+2, replaced.indexOf('}}')).split(':');
            let replacedEntity = 'invalid parameter';
            switch(entity[0]){
                case 'column':
                    await fetch(`http://localhost:5000/api/columns/column/${entity[1]}`, {
                        method: 'GET',
                        credentials: 'include',
                    })
                    .then((response) => response.json())
                    .then((response) => {
                        replacedEntity = response.name;
                    });
                    break;
                case 'user': 
                    await fetch(`http://localhost:5000/api/users/${entity[1]}`, {
                        method: 'GET',
                        credentials: 'include',
                    })
                    .then((response) => response.json())
                    .then((response) => {
                        replacedEntity = response.username;
                    });
                    break;
                case 'card':
                    await fetch(`http://localhost:5000/api/cards/card/${entity[1]}`, {
                        method: 'GET',
                        credentials: 'include',
                    })
                    .then((response) => response.json())
                    .then((response) => {
                        replacedEntity = response.name;
                    });
                    break;
                default:
                    break;
            }
            replaced = replaced.replace(`{{${entity[0]}:${entity[1]}}}`, replacedEntity);
        }
        return replaced;
    }
};