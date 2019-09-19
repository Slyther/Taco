export default{
    async replace(string, models) {
        let replaced = string;
        while(replaced.includes('{{') || replaced.includes('}}')){
            let entity = replaced.substring(replaced.indexOf('{{')+2, replaced.indexOf('}}')).split(':');
            let dbEntity = await models[entity[0]].findById(entity[1]);
            let replacedEntity = dbEntity.name || dbEntity.username || 'invalid parameter';
            replaced = replaced.replace(`{{${entity[0]}:${entity[1]}}}`, replacedEntity);
        }
        return replaced;
    }
};