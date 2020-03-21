// Объект для работы с файлами
const fs = require('fs');

// Рандом - необходим для генерации случайных сущностей
function rand(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

// Параметры - имя сущности и массив имен столбцов
const sqlInsert= (entity_name,fields) => {
    const fieldsName = "("+fields.join(",")+")";
    return (data) => {	// Принимает массив значений
        const dataStr = data.join(",");
        return `INSERT INTO "MYUSER"."${entity_name}" ${fieldsName} VALUES (${entity_name}_IDS.NEXTVAL,${dataStr});`
    }
}

const sqlInsertFactory = (entity) => (arr) => arr.map(entity);

// --  Пример использования
// Сущность 
const Habitat = (title) => sqlInsert("HABITAT",["ID","TITLE"])([title]);
const habitatFactory = sqlInsertFactory(Habitat);

// Массив значений title
const HabitatsArr = [
    "'Болото'",
    "'Лес'",
    "'Город'",
    "'Горы'",
    "'Пещера'",
    "'Замок'",
    "'Острова'"
	];

// Места обитания
const Habitats = habitatFactory(HabitatsArr).join('\n');

// Собирает все инсерты в одину строку
const result=[Habitats].join("\n\n");

fs.writeFileSync("insert.txt",result);