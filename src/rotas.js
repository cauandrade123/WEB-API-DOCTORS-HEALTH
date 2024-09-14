import consultaController from './controller/consultaController.js'

export default function adicionarRotas(servidor){
    servidor.use(consultaController)
}