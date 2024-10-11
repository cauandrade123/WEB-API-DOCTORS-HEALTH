import consultaController from './controller/consultaController.js'
// import emailController from './controller/emailController.js'

export default function adicionarRotas(servidor){
    servidor.use(consultaController)
    // servidor.use(emailController)
}