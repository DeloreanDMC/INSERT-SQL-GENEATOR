const fs = require('fs');
const names = require('./names.js');
const nextYear = require('./nextYear.js');
const genDate = require('./dateGenerator.js');
const plus0 = (num) => num<10?"0"+num:num;

function rand(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

const sqlInsert= (entity_name,fields) => {
    const fieldsName = "("+fields.join(",")+")";
    return (data) => {
        const dataStr = data.join(",");
        return `INSERT INTO "MYUSER"."${entity_name}" ${fieldsName} VALUES (${entity_name}_IDS.NEXTVAL,${dataStr});`
    }
}

const sqlInsertNoId= (entity_name,fields) => {
    const fieldsName = "("+fields.join(",")+")";
    return (data) => {
        const dataStr = data.join(",");
        return `INSERT INTO "MYUSER"."${entity_name}" ${fieldsName} VALUES (${dataStr});`
    }
}

const sqlInsertFactory = (entity) => (arr) => arr.map(entity);

const Habitat = (title) => sqlInsert("HABITAT",["ID","TITLE"])([title]);
const habitatFactory = sqlInsertFactory(Habitat);

const CSD = (title) => sqlInsert("CAUSE_OF_DEATH",["ID","TITLE"])([title]);
const CSDFactory = sqlInsertFactory(CSD);

const source_of_power = (title) => sqlInsert("SOURCE_OF_POWER",["ID","TITLE"])([title]);
const SOPFactory = sqlInsertFactory(source_of_power);

const position = (title) => sqlInsert("POSITION",["ID","TITLE"])([title]);
const positionFactory = sqlInsertFactory(position);

const coven = (title) => sqlInsert("COVEN",["ID","TITLE"])([title]);
const covenFactory = sqlInsertFactory(coven);

const ritual = (title) => sqlInsert("RITUAL",["ID","TITLE"])([title]);
const ritualFactory = sqlInsertFactory(ritual);

const mountain = ({title,address}) => sqlInsert("MOUNTAIN",["ID","TITLE","ADDRESS"])([title,address]);
const mountainFactory = sqlInsertFactory(mountain);

const broom_mark = ({title,year}) => sqlInsert("BROOM_MARK",["ID","TITLE","YEAR"])([title,year]);
const broom_markFactory = sqlInsertFactory(broom_mark);

const ability = ({title,source_id}) => sqlInsert("ABILITY",["ID","TITLE","SOURCE_ID"])([title,source_id]);
const abilityFactory = sqlInsertFactory(ability);

const sabbath = ({night,mountain_id})=>sqlInsert("SABBATH",["ID","NIGHT","MOUNTAIN_ID"])([night,mountain_id]);
const sabbathFactory = sqlInsertFactory(sabbath);

const broom = ({license,mileage,witch_id,mark_id})=>sqlInsertNoId("BROOM",["LICENSE","MILEAGE","WITCH_ID","MARK_ID"])
([license,mileage,witch_id,mark_id]);
const broomFactory = sqlInsertFactory(broom);

const taking_office = ({entry_date,witch_id,position_id}) => sqlInsertNoId(
     "TAKING_OFFICE",["ENTRY_DATE","WITCH_ID","POSITION_ID"])
     ([entry_date,witch_id,position_id]);
const taking_officeFactory = sqlInsertFactory(taking_office);

const skill_ability = ({Level,confirm_date,witch_id,ability_id}) =>
sqlInsertNoId("SKILL_ABILITY",['"Level"',"CONFIRM_DATE","WITCH_ID","ABILITY_ID"])
([Level,confirm_date,witch_id,ability_id]);
const skill_abilityFactory = sqlInsertFactory(skill_ability);

const part_in = ({sponsor,coven_id,sabbath_id}) => sqlInsertNoId("PART_IN",["SPONSOR","COVEN_ID","SABBATH_ID"])
([sponsor,coven_id,sabbath_id]);
const part_inFactory = sqlInsertFactory(part_in);

// Шабаш
const generateSabbath = () => {
    const mountain_id = rand(2,26);
    const {DD, MM, YYYY} = genDate({min:666,max:2066});
    const date = `${plus0(DD)}.${plus0(MM)}.${YYYY}`;
    const night = `TO_DATE('${date}','DD.MM.YYYY')`;
    return {night, mountain_id,__night:{DD, MM, YYYY}};
}
const sabbathArr = (new Array(666)).fill({}).map(_el=>generateSabbath());

const witch = ({full_name,birthday,deathday,habitat_id,why_died_id,coven_id}) => 
    sqlInsert("WITCH",["ID","FULL_NAME","BIRTHDAY_DATE","DEATH_DATE","HABITAT_ID","WHY_DIED_ID","COVEN_ID"])
    ([full_name,birthday,deathday,habitat_id,why_died_id,coven_id]);
const witchFactory = sqlInsertFactory(witch);

// Ведьма
// Генерация Ф.И.-О
const generateFULL_NAME = () => {
    const max = names.length-1;
    const name_index = rand(0, max);
    const surname_index = rand(0, max-1); 
    const name = names[name_index];
    const surname = names.filter((el,i)=>i!==name_index)[surname_index];
    return `'${name} ${surname}'`;
}

// Генерация даты рождения
const generateBirthday = () => {
    const {DD, MM, YYYY} = genDate();
    const date = `${plus0(DD)}.${plus0(MM)}.${YYYY}`;
    return {birthday:`TO_DATE('${date}','DD.MM.YYYY')`,__birthday:{DD, MM, YYYY}};
}

// Генерирует дату смерти
const generateDeathDay = (year) => {
    const probability = (year>=1401)&&(year<=1650) ? 2 : 8;
    let deathday = "NULL";
    let __deathday = "NULL";
    let why_died_id = "NULL";
    // Умерла ли ведьма
    if (rand(1,probability)===probability-1) {
        const {DD, MM, YYYY} = genDate({min:year+20<1998?year+20:year+1,max:year+120<2019?year+120:2019});
        const date = `${plus0(DD)}.${plus0(MM)}.${YYYY}`;
        deathday = `TO_DATE('${date}','DD.MM.YYYY')`;
        __deathday = {DD, MM, YYYY};
        why_died_id = probability===2?2:rand(2,5);
    }

    return {deathday,why_died_id,__deathday};
} 
// Генерирует объект вельмы
const generateWitch = () => {
    const full_name = generateFULL_NAME();
    const {birthday,__birthday} = generateBirthday();
    const {deathday,why_died_id,__deathday} = generateDeathDay(__birthday.YYYY);
    const habitat_id = rand(2,9);
    const coven_id = rand(2,15);
    return {full_name,birthday,deathday,habitat_id,why_died_id,coven_id,__birthday,__deathday};
}

const witchArr = (new Array(666)).fill({}).map(_el=>generateWitch());

// Места обитания
const HabitatsArr = [
    "'Болото'",
    "'Лес'",
    "'Город'",
    "'Горы'",
    "'Пещера'",
    "'Замок'",
    "'Острова'"];

// Причины смерти
const CSDSArr = [
    "'Сожжена'",
    "'Проклята'",
    "'Серебряные пули-меч'"
];

// Источник силы
const SOPSArr= [
    "'Сердце дракона'",
    "'Солнце'",
    "'Владыка света'",
    "'Души'",
    "'Энергия жизни'",
    "'Смерть'",
    "'Сатана'",
    "'Старшая кровь'",
    "'Мутаген'",
    "'Стихия'"
];

// Способности
const abilityTitleArr = [
    "'Иллюзия'",
    "'Умервщление'",
    "'Телекинез'",
    "'Телепортация'",
    "'Телепатия'", 
    "'Парализация'",
    "'Исцеление'",
    "'Искажение времени'", 
    "'Призыв'",
    "'Квен'",
    "'Игни'",
    "'Ирден'",
    "'Взрыв'", 
    "'Магический удар'", 
    "'Создание копий'"
];

// Способности
//const abilityArr = abilityTitleArr.map(el=>( {title:abilityTitleArr[rand(0,abilityTitleArr.length-1)],source_id:rand(2,SOPSArr.length+1)}));
const abilityArr = [];
for (let i=2;i<12;++i) {
    let hash = {};
    for (let j=0;j<15;++j) {
        const index = rand(0,abilityTitleArr.length);
        if (hash[index]) 
            continue;
        abilityArr.push(
            {   title:  abilityTitleArr[index],
                source_id:  i
            });
        hash[index] = true;
    }
}

// Должности
const positionsArr = [
    "'Верховная жрица'",
    "'Владыка'",
    "'Магистр'",
    "'Заклинатель'",
    "'Хранитель'",
    "'Девица'",
    "'Иллюзионист'",
    "'Проводник'",
    "'Травница'",
    "'Прорицательница'",
    "'Пожиратель смерти'",
    "'Друид'",
    "'Книжник'"
];

// Ковены 
const covenArr = [
    "'Алькаирский ковен'",
    "'Гленморильский ковен'",
    "'Даггерфольский ковен'",
    "'Девилрокский ковен'",
    "'Ковен Дочерей Врота'",
    "'Ковен Пики'",
    "'Тамарлинский ковен'",
    "'Скефинтонский ковен'",
    "'Ковен Топи'",
    "'Ковен Сестёр Кикос'",
    "'Ковен Сестёр Блефа'",
    "'Ковен Приливов'",
    "'Ковен Праха'"
];

// Обряды
const ritualArr = [
    "'Братание'",
    "'Великий Бал'",
    "'Военное Празднество'",
    "'Дикая Охота'",
    "'Единение'",
    "'Игры Инстинкта'",
    "'Карнавал Мёртвых'",
    "'Кровавая Купель'",
    "'Кровавый Пир'",
    "'Мономахия'",
    "'Наставления Каина'", 
    "'Огненная Пляска'",
    "'Ритуал Создания'"
];

// Горы
const mountainArr = [
    {title:"'Голахи'",address:"'Янтарный страж'"},
    {title:"'Борбгур'", address:"'Амол'"}, 
    {title:"'Авен'", address:"'Чёрное болото'"},  
    {title:"'Скалара'", address:"'Драконий Мост'"},  
    {title:"'Глотка Мира'", address:"'Драконий Лес'"},  
    {title:"'Зуб бобра'", address:"'Стена Данпар'"},  
    {title:"'Йотунхейм'", address:"'Роща Данстад'"},  
    {title:"'Велоти'", address:"'Хеларчен Крик'"},  
    {title:"'Джерол'", address:"'Гранитный зал'"},  
    {title:"'Друадах'", address:"'Гринвал'"},  
    {title:"'Ириндол'", address:"'Картвастен Холл'"},  
    {title:"'Ларамуд'", address:"'Лейнальтен'"},  
    {title:"'Винтерлар'", address:"'Лайнтар Дейл'"},  
    {title:"'Зимерун'", address:"'Маркарт Сайд'"},  
    {title:"'Тимеру'", address:"'Дозор Нойград'"},  
    {title:"'Фавн'", address:"'Нималтен'"},  
    {title:"'Лорн'", address:"'Северная крепость'"},  
    {title:"'Теймп импала'", address:"'Дубовый лес'"},  
    {title:"'Холли берри'", address:"'Деревня Палгран'"},  
    {title:"'Йеннифер'", address:"'Райк Коригейт'"},  
    {title:"'Миринда'", address:"'Ривервуд'"},  
    {title:"'Дитерон'", address:"'Каменные холмы'"},  
    {title:"'Элеборн'", address:"'Сангард'"},  
    {title:"'Дракарис'", address:"'Лес Верним'"}
];

const mark_names = ["Нимбус","Сосна","Бабка ёжка","Молния","Крик","Кость короля"].map(el=>`'${el}'`);
let broom_markArr = [...(new Set((new Array(66)).fill({})
.map(_el=>({title:mark_names[rand(0,6)],year:nextYear()}))))]
.filter((obj,i,arr)=>arr.filter(el=>el.title==obj.title&&obj.year==el.year).length<=1);

broom_markArr = broom_markArr.filter((obj,i,arr)=>arr.filter(el=>el.title==obj.title&&obj.year==el.year).length<=1);

// Метлы ведьм
let LicNum = {num:666,char:{a:0,b:0,c:0}};
let alpha = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
const incLicNum = () => {
    let {num,char} = LicNum;
    let {a,b,c} = char;
    const incAl = (ch) => ((ch+1)>alpha.length-1) ? 0 : ch+1;
    
    c = incAl(c);
    if (c===0) {
        b = incAl(b);
        if (b===0) {
            a = incAl(a);
            if (a===0) {
                num+=1;
            }       
        }
    }
    
    LicNum.num = num;
    LicNum.char = {a,b,c};
}
// Генерирует госномер
const genLicense = () => {
    incLicNum();
    return `'${alpha[LicNum.char.a]+LicNum.num+alpha[LicNum.char.b]+alpha[LicNum.char.c]}'`;
}

const genBroom = (id) => {
    const license = genLicense();
    const mileage = rand(0,666666);
    const witch_id = id || rand(2,668);
    const mark_id = rand(2,broom_markArr.length+2);
    return {license,mileage,witch_id,mark_id};
};

const broomArr = (new Array(666*2)).fill({}).map(_el=>genBroom());
for(let i = 2;i<=667;++i) broomArr.push(genBroom(i));


// Вступление в должность   
// Генерирует дату вступления
const genEntryDate = (id_witch) => {
    const witch = witchArr[id_witch-2];
    const min = witch.__birthday.YYYY;
    const max = witch.__deathday.YYYY||2020;

    const {DD, MM, YYYY} = genDate({min,max});

    const date = `${plus0(DD)}.${plus0(MM)}.${YYYY}`;
    return `TO_DATE('${date}','DD.MM.YYYY')`;
};

// Генерирует вступление в должность
const genTakingOffice = (id)=> {
    const witch_id = id || rand(2,668);
    const entry_date = genEntryDate(witch_id);
    const position_id = rand(2,positionsArr.length+2);
    return {entry_date,witch_id,position_id};
};
const taking_officeArr = (new Array(666*2)).fill({}).map(_el=>genTakingOffice());
for(let i = 2;i<=667;++i) taking_officeArr.push(genTakingOffice(i));

const skill_abilityArr = [];

// Генерация строки времени
const genStrDate = ({DD, MM, YYYY}) => {
    const date = `${plus0(DD)}.${plus0(MM)}.${YYYY}`;
    return `TO_DATE('${date}','DD.MM.YYYY')`;
};
// Подтверждение способности
// Генерация случайного уровня
const genLevel = (curLevel) => rand(curLevel,11);

const genConfirm = (dateRange,witch_id,ability_id) => {
    // Дата начала
    const start_time = genDate(dateRange);
    const start_level = rand(1,11);
    const startObj = {
        Level:  start_level,
        confirm_date:   genStrDate(start_time),
        witch_id,
        ability_id
    };
    // Добавляем начальное поддверждение
    skill_abilityArr.push(startObj);

    // Инициализация текущего
    let cur_level = start_level;
    let cur_time = start_time;

    // Сдвигаем текущую дату поддверждение и уровень
    cur_level = genLevel(cur_level);
    cur_time = genDate({
        min:    cur_time.YYYY+1,
        max:    dateRange.max});

    // Пока дата и уровень корректны - двигаемся дальше
    while(cur_level < 11 && cur_time.YYYY < dateRange.max) {
        const obj = {
            Level:  cur_level,
            confirm_date:   genStrDate(cur_time),
            witch_id,
            ability_id
        };
        cur_level = genLevel(cur_level);
        cur_time = genDate({
            min:    cur_time.YYYY+1,
            max:    dateRange.max});
    }
};

// Генерация способности
// Для каждой ведьмы - рандомное кол-во способностей
// Для каждой способности генерируем подтверждения
const genSkill_ability = (id_witch) => {
    const witch = witchArr[id_witch-2];
    const countAbility = rand(5, 11);
    // Массив id способностей
    const abilArr = [...new Set(new Array(countAbility).fill(0).map(el=>rand(2,abilityArr.length+2)))];

    const dateRange = {
        min:  witch.__birthday.YYYY,
        max:    (witch.__deathday!=="NULL" ? witch.__deathday.YYYY : 2019)
    };

    const witch_id = id_witch;

    abilArr.forEach(ab_id=>genConfirm(dateRange,witch_id,ab_id));

};
// Для каждой ведьмы генерируем кол-во способностей
witchArr.forEach((el,i)=>genSkill_ability(i+2));

// Участие в шабаше
let part_inArr = [];

// Для каждого шабаша генерируем участников
const genPart_in = (sabbath_id) => {
    const countCoven = rand(1,14);
    const sabbat = sabbathArr[sabbath_id-2];
    
    // Массив id ковенов
    let covArr = [...new Set((new Array(countCoven)).fill(0).map(el=>rand(2,15)))];
    // Проверка, что данный ковен в эту ночь участвует только в этом шабаше
    covArr = covArr.filter(  cov_id  =>  {
        return (part_inArr.filter((obj)=>
            obj.coven_id===cov_id  &&
            obj.__night.YYYY === sabbat.__night.YYYY &&
            obj.__night.MM  === sabbat.__night.MM    &&
            obj.__night.DD === sabbat.__night.DD
        ).length===0);

    });
  
    // Рандомное кол-во организаторов
    const countOrg = rand(1,covArr.length);
    covArr.forEach( (cov_id,i) => 
        part_inArr.push ({  
                sponsor: (i < countOrg) ? "'Y'" : "'N'",
                coven_id: cov_id,
                sabbath_id,
                __night:sabbat.__night
            })
    );
};

// У одного шабаша могут быть несколько организаторов. 
// Необходимо контролировать, что определенный ковен за одну ночь участвует только в одном шабаше.
// Для каждого шабаша 
sabbathArr.forEach((el,i)=>genPart_in(i+2));


// Места обитания
const Habitats = habitatFactory(HabitatsArr).join('\n');
// Причины смерти
const CSDS = CSDFactory(CSDSArr).join('\n');
// Источник силы
const SOPS = SOPFactory(SOPSArr).join('\n');
// Должности
const positions = positionFactory(positionsArr).join('\n');
// Ковены
const covens = covenFactory(covenArr).join('\n');
// Обряды
const rituals = ritualFactory(ritualArr).join('\n');
// Горы
const mountains = mountainFactory(mountainArr).join('\n');
// Марки метл
const broom_marks = broom_markFactory(broom_markArr).join('\n');
// Способности
const abilities = abilityFactory(abilityArr).join('\n');
// Ведьмы 
const witches = witchFactory(witchArr).join('\n');
// Шабаши
const sabbaths = sabbathFactory(sabbathArr).join('\n');
// Метлы
const brooms = broomFactory(broomArr).join('\n');
// Вступление в должность
const taking_offices = taking_officeFactory(taking_officeArr).join('\n');
// Подтверждение способности
const skill_abiliteis = skill_abilityFactory(skill_abilityArr).join('\n');
// Участник шабаша
const part_ins = part_inFactory(part_inArr).join('\n');

// const result=[Habitats,CSDS,SOPS,positions,covens,rituals,mountains,broom_marks,abilities,witches,sabbaths,brooms].join("\n\n");
const result=[
    Habitats,
    CSDS,
    SOPS,
    positions,
    covens,
    rituals,
    mountains,
    broom_marks,
    abilities,
    witches,
    brooms,
    taking_offices,
    skill_abiliteis,
    sabbaths,
    part_ins
].join("\n\n");

// fs.writeFileSync("TEST.txt",part_ins);
fs.writeFileSync("skill_abiliteis.txt",result);