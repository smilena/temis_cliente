
export let FORM_TRADUCCION = {
    titulo: 'Traduccion',
    tipo_formulario: 'mini',
    btn: 'Guardar',
    alertas: true,
    modelo: 'Traduccion',
    campos: [
    {
        etiqueta: 'select',
        claseGrid: 'col-2',
        nombre: 'TipoTraduccion',
        label_i18n: 'tipotraduccion',
        placeholder_i18n: 'tipotraduccion',
        requerido: true,
        tipo: 'TipoTraduccion',
        key: 'Nombre',
        opciones: [],
    },
    {
        etiqueta: 'input',
        claseGrid: 'col-5',
        nombre: 'Titulo',
        label_i18n: 'titulo_traduccion',
        placeholder_i18n: 'titulo',
        requerido: true,
        tipo: 'text',
    },
    {
        etiqueta: 'input',
        claseGrid: 'col-5',
        nombre: 'NombreOriginal',
        label_i18n: 'nombreoriginal',
        placeholder_i18n: 'nombreoriginal',
        requerido: true,
        tipo: 'text',
    },
    {
        etiqueta: 'input',
        claseGrid: 'col-3',
        nombre: 'Autor',
        label_i18n: 'autor',
        placeholder_i18n: 'autor',
        requerido: true,
        tipo: 'text',
    },
    {
        etiqueta: 'select',
        claseGrid: 'col-2',
        nombre: 'IdiomaOriginal',
        label_i18n: 'idiomaoriginal',
        placeholder_i18n: 'idiomaoriginal',
        requerido: true,
        relacion: false,
        tipo: 'Idiomas',
        key: 'Nombre',
        opciones: [],
    },
    {
        etiqueta: 'select',
        claseGrid: 'col-2',
        nombre: 'IdiomaTraducido',
        label_i18n: 'idiomatraducido',
        placeholder_i18n: 'idiomatraducido',
        requerido: true,
        relacion: false,
        tipo: 'Idiomas',
        key: 'Nombre',
        opciones: [],
    },
    {
        etiqueta: 'input',
        claseGrid: 'col-2',
        nombre: 'Ano',
        label_i18n: 'ano',
        placeholder_i18n: 'ano',
        requerido: true,
        tipo: 'number',
        minimo: 1500,
    },
    // {
    //     etiqueta: 'input',
    //     claseGrid: 'col-1',
    //     nombre: 'Mes',
    //     label_i18n: 'mes',
    //     placeholder_i18n: 'mes',
    //     requerido: true,
    //     tipo: 'number',
    //     // maximo: 12,
    //     minimo: 1,
    // },
    {
        etiqueta: 'select',
        claseGrid: 'col-2',
        nombre: 'Mes',
        label_i18n: 'mes',
        placeholder_i18n: 'mes',
        requerido: true,
        tipo: 'number',
        key: 'Nombre',
        relacion: false,
        opciones: [
            { Id: 1, Nombre: 'Enero'},
            { Id: 2, Nombre: 'Febrero'},
            { Id: 3, Nombre: 'Marzo' },
            { Id: 4, Nombre: 'Abril' },
            { Id: 5, Nombre: 'Mayo' },
            { Id: 6, Nombre: 'Junio' },
            { Id: 7, Nombre: 'Julio' },
            { Id: 8, Nombre: 'Agosto' },
            { Id: 9, Nombre: 'Septiembre|' },
            { Id: 10, Nombre: 'Octubre' },
            { Id: 11, Nombre: 'Noviembre'},
            { Id: 12, Nombre: 'Diciembre' },
        ],
    },
    {
        etiqueta: 'select',
        claseGrid: 'col-2',
        nombre: 'MedioDivulgacion',
        label_i18n: 'mediodivulgacion',
        placeholder_i18n: 'mediodivulgacion',
        requerido: true,
        tipo: 'MedioDivulgacion',
        key: 'Nombre',
        opciones: [],
    },
    {
        etiqueta: 'input',
        claseGrid: 'col-1',
        nombre: 'Edicion',
        label_i18n: 'edicion',
        placeholder_i18n: 'placeholder_edicion',
        requerido: true,
        tipo: 'number',
        minimo: 1,
    },
    {
        etiqueta: 'input',
        claseGrid: 'col-1',
        nombre: 'Serie',
        label_i18n: 'serie',
        placeholder_i18n: 'serie',
        requerido: true,
        tipo: 'number',
        minimo: 1,
    },
    ],
}