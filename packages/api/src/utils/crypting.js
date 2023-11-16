//import bcrypt from 'bcrypt';

export const hashPassword = async (password) => {
    //try {
    //    return await bcrypt.hash(password, 10);
    //} catch (error) {
    //    console.error(error)
    //}

    return 'hejsan'
}

export const comparePasswords = async (passwordFromUser, passwordFromDb) => {
    //try {
    //    return await bcrypt.compare(passwordFromUser, passwordFromDb);
    //} catch (error) {
    //    console.error(error)
    //}
    return true;
}