const charactersModel ={
    getAll:`
     SELECT
        *
     FROM 
         personajes
    `,
    getByID:`
    SELECT
    *
 FROM 
     personajes
WHERE

ID_PERSONAJES=?   
    `,
    addRow:`
    INSERT INTO
    personajes(
        Nombre,
        LocateInGame,
        CondicionRecluta,
        Genero,
        Info_Activa
    )
    VALUES(
      ?,?,?,?,?  
    )`,

    getByName:`
    SELECT
        *
    FROM
        personajes
    WHERE 
        nombre = ?    
    `,
  
    
    updateRow:`
    UPDATE
        personajes
    SET
        Nombre=?,
        LocateInGame =?,
        CondicionRecluta =?,
        Genero =?,
        Info_Activa =?
    WHERE
    ID_PERSONAJES=?
    `,

    deleteRow:`
    UPDATE
         personajes
    SET
         Info_Activa=0
    WHERE
         ID_PERSONAJES=?

    `,
    

};

module.exports=charactersModel;