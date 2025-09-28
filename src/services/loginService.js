    import * as UserRepository from '../repository/consultaRepository.js'
    import jwt from 'jsonwebtoken';


    class UserService{
        async login(info){

            const usuario = await UserRepository.verificarLogin(info)

            if(!usuario){
                console.log("usuário não encontrado");
                return null;
            }

            if(usuario.senha !== info.senha){
                console.log("senha incorreta ou não encontrada")
                throw new Error("Senha incorreta");
            }

            const token = jwt.sign({ id: usuario.id_login }, process.env.JWT_SECRET);

            return token;

        }
    }



    export default new UserService;