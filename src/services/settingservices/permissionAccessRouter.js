import axios from "axios";
import { API_URL, getAuthorized } from "../../utils/urls"

export const acessPermission = async () => {
    const {data} = await axios.get(`${API_URL}/permission/read`,getAuthorized());
    
    return data ;
}

