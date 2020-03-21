-- <Способность (Ability)> 
    -- Содержит информацию о способности: источник способности и название
    CREATE TABLE ability (
        id         NUMBER NOT NULL,       -- #
        title      VARCHAR2(20) NOT NULL, -- Название
        source_id  NUMBER NOT NULL        -- Источник способности
    );
    -- Название и источник в совокупности уникальны 
    ALTER TABLE ability ADD CONSTRAINT ability_un UNIQUE( title, source_id );
    -- #
    ALTER TABLE ability ADD CONSTRAINT ability_pk PRIMARY KEY ( id );
-- </Способность (Ability)> 

-- <Метла (Broom)>
    -- Содержит основную информацию о метле ведьмы: госномер, марка метлы, пробег и владелец.
    -- Владелец никогда не меняется, потому что ведьмы жадные существа.
    CREATE TABLE broom (
        license   CHAR(6) NOT NULL, -- Госномер #
        mileage   NUMBER NOT NULL,      -- Пробег
        witch_id  NUMBER NOT NULL,      -- Владелец FK
        mark_id   NUMBER NOT NULL       -- Марка метлы FK
    );
    -- Пробег не может быть меньше 0
    ALTER TABLE broom ADD CONSTRAINT broom_MCH CHECK ( mileage >= 0 );
    -- #
    ALTER TABLE broom ADD CONSTRAINT broom_pk PRIMARY KEY ( license );
-- </Метла (Broom)>

-- <Марка метлы (Broom_mark)>
    -- Содержит основную информацию о марке метлы: название, год выпуска.
    CREATE TABLE broom_mark (
        id     NUMBER NOT NULL,       -- #
        title  VARCHAR2(20) NOT NULL, -- Название
        year   NUMBER NOT NULL        -- Год выпуска
    );
    -- Название и год выпуска в совокупности уникальны 
    ALTER TABLE broom_mark ADD CONSTRAINT broom_mark_un UNIQUE ( title, year );
    -- Год больше 0
    ALTER TABLE broom_mark ADD CONSTRAINT broom_mark_YCH CHECK ( year > 0 );
    -- #
    ALTER TABLE broom_mark ADD CONSTRAINT broom_mark_pk PRIMARY KEY ( id );
-- </Марка метлы (Broom_mark)>

-- <Причина смерти (Cause_of_death)>
    -- Содержит информацию о причине смерти ведьмы
    CREATE TABLE cause_of_death (
        id     NUMBER NOT NULL,         -- #
        title  VARCHAR2(20) NOT NULL   -- Название
    );
    -- #
    ALTER TABLE cause_of_death ADD CONSTRAINT cause_of_death_pk PRIMARY KEY ( id );
    -- Название уникально
    ALTER TABLE cause_of_death ADD CONSTRAINT cause_of_death__un UNIQUE ( title );
-- </Причина смерти (Cause_of_death)>

-- <Ковен (Coven)>
    -- Содержит информацию о ковене.
    CREATE TABLE coven (
        id     NUMBER NOT NULL,         -- #
        title  VARCHAR2(32) NOT NULL   -- Название
    );
    -- #
    ALTER TABLE coven ADD CONSTRAINT coven_pk PRIMARY KEY ( id );
    -- Название уникально
    ALTER TABLE coven ADD CONSTRAINT coven__un UNIQUE ( title );
-- </Ковен (Coven)>

-- <Место обитания (Habitat)>
    -- Содержит информацию о месте, где возможно встретить ведьму
    CREATE TABLE habitat (
        id     NUMBER NOT NULL,        -- # 
        title  VARCHAR2(32) NOT NULL   -- Название
    );
    -- #
    ALTER TABLE habitat ADD CONSTRAINT habitat_pk PRIMARY KEY ( id );
    -- Название уникально
    ALTER TABLE habitat ADD CONSTRAINT habitat__un UNIQUE ( title );
-- </Место обитания (Habitat)>

-- <Гора (Mountain)>
    -- Содержит информацию о горе, на которой проводится шабаш.
    CREATE TABLE mountain (
        id  NUMBER NOT NULL,                 -- # 
        title        VARCHAR2(32) NOT NULL, -- Название
        address      VARCHAR2(32) NOT NULL  -- Адрес
    );
    -- Название и адрес в совокупности уникальны
    ALTER TABLE mountain ADD CONSTRAINT mountain_ck_un UNIQUE ( title, address );
    -- #
    ALTER TABLE mountain ADD CONSTRAINT mountain_pk PRIMARY KEY ( id );
-- </Гора (Mountain)>

-- <Участие в шабаше (Part_In)>
    -- Содержит информацию о том, какой ковен, в каком шабаше принимает участие, 
    -- является ли организатором. У одного шабаша могут быть несколько организаторов. 
    -- Необходимо контролировать, что определенный ковен за одну ночь участвует только в одном шабаше.
    CREATE TABLE part_in (
        sponsor     CHAR(1) NOT NULL, -- Является ли организатором
        coven_id    NUMBER NOT NULL,  -- Ковен FK #
        sabbath_id  NUMBER NOT NULL   -- Шабаш FK #
    );
    -- sponsor = Y or N
    ALTER TABLE part_in
        ADD CHECK ( sponsor IN (
            'N',
            'Y'
        ) );
    -- #
    ALTER TABLE part_in ADD CONSTRAINT part_in_pk PRIMARY KEY ( coven_id,
                                                                sabbath_id );
-- </Участие в шабаше (Part_In)>

-- <Должность (Position)>
    -- Содержит информацию, о должности.
    CREATE TABLE position (
        id     NUMBER NOT NULL,         -- #
        title  VARCHAR2(32) NOT NULL   -- Название
    );
    -- #
    ALTER TABLE position ADD CONSTRAINT position_pk PRIMARY KEY ( id );
    -- Название уникально
    ALTER TABLE position ADD CONSTRAINT position__un UNIQUE ( title );
-- </Должность (Position)>

-- <Обряд (Ritual)>
    -- Содержит информацию о проводимом обряде.
    CREATE TABLE ritual (
        id      NUMBER NOT NULL,         -- #
        title   VARCHAR2(32) NOT NULL   -- Название
    );
    -- #
    ALTER TABLE ritual ADD CONSTRAINT ritual_pk PRIMARY KEY ( id );
    -- Название уникально
    ALTER TABLE ritual ADD CONSTRAINT ritual__un UNIQUE ( title );
-- </Обряд (Ritual)>

-- <Проведение обряда (Ritual_Accounting)>
    -- Содержит информацию о том, на каком шабаше, какой обряд был проведен, каким по счету. 
    -- На одном шабаше может проводиться несколько обрядов. Один и тот же обряд могут провести несколько раз
    CREATE TABLE ritual_accounting (
        "Number"    NUMBER NOT NULL,       -- Каком по счету #
        sabbath_id  NUMBER NOT NULL,       -- На каком шабаше FK #
        ritual_id   NUMBER NOT NULL        -- Какой обряд FK #
    );
    -- Счет ведется от 1
    ALTER TABLE ritual_accounting ADD CHECK ( "Number" > 0 );
    -- #
    ALTER TABLE ritual_accounting
        ADD CONSTRAINT ritual_accounting_pk PRIMARY KEY ( "Number",
                                                        sabbath_id,
                                                        ritual_id );
-- </Проведение обряда (Ritual_Accounting)>

-- <Шабаш (Sabbath)>
    -- Содержит информацию о месте и времени проведения шабаша.
    CREATE TABLE sabbath (
        id           NUMBER NOT NULL,   -- #
        night        DATE NOT NULL,     -- Дата проведения
        mountain_id  NUMBER NOT NULL    -- Гора FK 
    );
    -- Ночь и гога в совокупности уникальны
    ALTER TABLE sabbath ADD CONSTRAINT sabbath_un UNIQUE (night, mountain_id);
    -- #
    ALTER TABLE sabbath ADD CONSTRAINT sabbath_pk PRIMARY KEY ( id );
-- </Шабаш (Sabbath)>

-- <Владение способностью (Skill_Ability)>
    -- Содержит информацию о том, какая ведьма, какой способностью владеет, 
    -- уровень владения данной способностью, и когда она это последний раз подтвердила. 
    -- Ведьмы могут обладать несколькими способностями.
    CREATE TABLE skill_ability ( 
        "Level"       NUMBER NOT NULL,  -- Уровень владения данной способностью #
        confirm_date  DATE NOT NULL,    -- Дата подтвердила #
        witch_id      NUMBER NOT NULL,  -- Ведьма FK #
        ability_id    NUMBER NOT NULL   -- Способность FK #
    );
    -- Уровни от 1 до 10
    ALTER TABLE skill_ability ADD CHECK ( "Level" BETWEEN 1 AND 10 );
    -- #
    ALTER TABLE skill_ability
        ADD CONSTRAINT skill_ability_pk PRIMARY KEY ( "Level",
                                                    confirm_date,
                                                    witch_id,
                                                    ability_id );
-- </Владение способностью (Skill_Ability)>

-- <Источник силы (Source_of_power)>
    -- Содержит информацию об источнике силы: название.
    CREATE TABLE source_of_power (
        id     NUMBER NOT NULL,         -- #
        title  VARCHAR2(32) NOT NULL    -- Название
    );
    -- #
    ALTER TABLE source_of_power ADD CONSTRAINT source_of_power_pk PRIMARY KEY ( id );
    -- Название уникально
    ALTER TABLE source_of_power ADD CONSTRAINT source_of_power__un UNIQUE ( title );
-- </Источник силы (Source_of_power)>

-- <Вступление в должность (taking_office)>
    -- Содержит информацию о том, какая ведьма, когда и на какую должность вступила.
    CREATE TABLE taking_office (
        entry_date   DATE NOT NULL,     -- Дата #
        witch_id     NUMBER NOT NULL,   -- Ведьма FK #
        position_id  NUMBER NOT NULL    -- Должность FK #
    );
    -- #
    ALTER TABLE taking_office
        ADD CONSTRAINT taking_office_pk PRIMARY KEY ( entry_date,
                                                    witch_id,
                                                    position_id );
-- </Вступление в должность>

-- <Ведьма (Witch)>
    --Содержит основную информацию о ведьме: Ф.И.О., возраст, место обитания, если ведьма умерла, то еще дату и причину смерти.
    CREATE TABLE witch (
        id             NUMBER NOT NULL,        -- #
        full_name      VARCHAR2(64) NOT NULL, -- Ф.И.О.
        birthday_date  DATE NOT NULL,          -- Дата рождения
        death_date     DATE,                   -- Дата смерти 0
        habitat_id     NUMBER NOT NULL,        -- Место обитания FK
        why_died_id    NUMBER,                 -- Причина смерти FK 0
        coven_id       NUMBER NOT NULL         -- Ковен FK
    );
	-- Дата рождения меньше death_date
	ALTER TABLE witch ADD CONSTRAINT witch_brn CHECK(death_date IS NULL OR birthday_date < death_date);
    -- #
    ALTER TABLE witch ADD CONSTRAINT witch_pk PRIMARY KEY ( id );
-- </Ведьма (Witch)>

-- <Внешние ключи>
    ALTER TABLE ability
        ADD CONSTRAINT ability_source_of_power_fk FOREIGN KEY ( source_id )
            REFERENCES source_of_power ( id );

    ALTER TABLE broom
        ADD CONSTRAINT broom_broom_mark_fk FOREIGN KEY ( mark_id )
            REFERENCES broom_mark ( id );

    ALTER TABLE broom
        ADD CONSTRAINT broom_witch_fk FOREIGN KEY ( witch_id )
            REFERENCES witch ( id );

    ALTER TABLE part_in
        ADD CONSTRAINT part_in_coven_fk FOREIGN KEY ( coven_id )
            REFERENCES coven ( id );

    ALTER TABLE part_in
        ADD CONSTRAINT part_in_sabbath_fk FOREIGN KEY ( sabbath_id )
            REFERENCES sabbath ( id );

    ALTER TABLE ritual_accounting
        ADD CONSTRAINT ritual_accounting_ritual_fk FOREIGN KEY ( ritual_id )
            REFERENCES ritual ( id );

    ALTER TABLE ritual_accounting
        ADD CONSTRAINT ritual_accounting_sabbath_fk FOREIGN KEY ( sabbath_id )
            REFERENCES sabbath ( id );

    ALTER TABLE sabbath
        ADD CONSTRAINT sabbath_mountain_fk FOREIGN KEY ( mountain_id )
            REFERENCES mountain ( id );

    ALTER TABLE skill_ability
        ADD CONSTRAINT skill_ability_ability_fk FOREIGN KEY ( ability_id )
            REFERENCES ability ( id );

    ALTER TABLE skill_ability
        ADD CONSTRAINT skill_ability_witch_fk FOREIGN KEY ( witch_id )
            REFERENCES witch ( id );

    ALTER TABLE taking_office
        ADD CONSTRAINT taking_office_position_fk FOREIGN KEY ( position_id )
            REFERENCES position ( id );

    ALTER TABLE taking_office
        ADD CONSTRAINT taking_office_witch_fk FOREIGN KEY ( witch_id )
            REFERENCES witch ( id );

    ALTER TABLE witch
        ADD CONSTRAINT witch_cause_of_death_fk FOREIGN KEY ( why_died_id )
            REFERENCES cause_of_death ( id );

    ALTER TABLE witch
        ADD CONSTRAINT witch_coven_fk FOREIGN KEY ( coven_id )
            REFERENCES coven ( id );

    ALTER TABLE witch
        ADD CONSTRAINT witch_habitat_fk FOREIGN KEY ( habitat_id )
            REFERENCES habitat ( id );
-- </Внешние ключи>

-- <Последовательности первичных ключей для каждой таблицы>
    CREATE SEQUENCE ability_ids START WITH 1 MINVALUE 1 MAXVALUE 666666 NOCACHE ORDER;

    CREATE SEQUENCE broom_mark_ids START WITH 1 MINVALUE 1 MAXVALUE 666666 NOCACHE ORDER;

    CREATE SEQUENCE cause_of_death_ids START WITH 1 MINVALUE 1 MAXVALUE 666 NOCACHE ORDER;

    CREATE SEQUENCE coven_ids START WITH 1 MINVALUE 1 MAXVALUE 666666 NOCACHE ORDER;

    CREATE SEQUENCE habitat_ids START WITH 1 MINVALUE 1 MAXVALUE 666 NOCACHE ORDER;

    CREATE SEQUENCE mountain_ids START WITH 1 MINVALUE 1 MAXVALUE 666666 NOCACHE ORDER;

    CREATE SEQUENCE position_ids START WITH 1 MINVALUE 1 MAXVALUE 666 NOCACHE ORDER;

    CREATE SEQUENCE ritual_ids START WITH 1 MINVALUE 1 MAXVALUE 666666 NOCACHE ORDER;

    CREATE SEQUENCE sabbath_ids START WITH 1 MINVALUE 1 MAXVALUE 666666 NOCACHE ORDER;

    CREATE SEQUENCE source_of_power_ids START WITH 1 MINVALUE 1 MAXVALUE 666666 NOCACHE ORDER;

    CREATE SEQUENCE witch_ids START WITH 1 MINVALUE 1 MAXVALUE 6666666 NOCACHE ORDER;
-- </Последовательности первичных ключей для каждой таблицы>