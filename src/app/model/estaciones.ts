export class EstacionesData {
    estacion: Estacion[] | undefined;
    constructor() {
        this.estacion = undefined;
    }
}

export interface Estacion {
    codigo: string;
    en_mantenimiento: number;
    horario_atencion: null | string;
    razon_social: string;
    distribuidor: Distribuidor;
    servicios: { [key: string]: boolean };
    metodos_de_pago: MetodosDePago;
    ubicacion: Ubicacion;
    punto_electrico: PuntoElectrico[];
    precios: Combustible;
}

export interface Distribuidor {
    marca: string;
    logo: string;
}

export interface MetodosDePago {
    Efectivo: boolean;
    Cheque: boolean;
    "Tarjeta Grandes Tiendas": boolean;
    "Tarjetas Bancarias": boolean;
    "Tarjeta de Crédito": boolean;
    "Tarjeta de Débito": boolean;
    "App de pago": boolean;
    "Billetera Digital": boolean;
}



export class Combustible {
    nombre: string;
    unidad_cobro: UnidadCobro;
    precio: string;
    fecha_actualizacion: Date;
    hora_actualizacion: string;
    tipo_atencion: TipoAtencion;

    constructor() {
        this.nombre='';
        this.unidad_cobro = UnidadCobro.L;
        this.precio = '';
        this.fecha_actualizacion = new Date();
        this.hora_actualizacion = '';
        this.tipo_atencion = TipoAtencion.Asistido;
    }
}

export interface CombustibleI {
    // nombre: String;
    fecha_actualizacion: string;
    hora_actualizacion: string;
    precio: string;
    tipo_atencion: string;
    unidad_cobro: string;
}

export enum TipoAtencion {
    Asistido = "Asistido",
    Autoservicio = "Autoservicio",
}

export enum UnidadCobro {
    L = "$/L",
    M3 = "$/m3",
}

export interface PuntoElectrico {
    tiene_cable: TieneCable;
    conexion: Conexion;
    tipo_conexion: TipoConexion;
    potencia_unitaria_kw: number;
    cantidad_conectores: number;
}

export enum Conexion {
    AC = "AC",
    Dc = "DC",
}

export enum TieneCable {
    Si = "SI",
}

export enum TipoConexion {
    Actipo2 = "ACTIPO2",
    Chademo = "CHADEMO",
    Dctipo2 = "DCTIPO2",
}

export interface Ubicacion {
    nombre_region: NombreRegion;
    codigo_region: string;
    nombre_comuna: string;
    codigo_comuna: string;
    direccion: string;
    latitud: string;
    longitud: string;
}

export enum NombreRegion {
    Antofagasta = "Antofagasta",
    AricaYParinacota = "Arica y Parinacota",
    Atacama = "Atacama",
    AysénDelGralCarlosIbáñezDelCampo = "Aysén del Gral. Carlos Ibáñez del Campo",
    Coquimbo = "Coquimbo",
    DeLaAraucanía = "De la Araucanía",
    DeLosLagos = "De los Lagos",
    DeLosRíos = "De los Ríos",
    DelBiobío = "Del Biobío",
    DelLibertadorGralBernardoOHiggins = "Del Libertador Gral. Bernardo O’Higgins",
    DelMaule = "Del Maule",
    MagallanesYDeLaAntárticaChilena = "Magallanes y de la Antártica Chilena",
    MetropolitanaDeSantiago = "Metropolitana de Santiago",
    Tarapacá = "Tarapacá",
    Valparaíso = "Valparaíso",
    Ñuble = "Ñuble",
}
