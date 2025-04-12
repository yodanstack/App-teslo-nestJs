

export const fileFilter = (req: Express.Request, file: Express.Multer.File, callback: Function)=> {    
    // console.log({file});
     
    if(!file) return callback(new Error('File is empty'), false);

    const fileExtencion = file.mimetype.split('/')[1];
    const validExtension = ['png', 'jpg', 'png', 'gif'];

    if(validExtension.includes(fileExtencion)) {
        return callback(null, true)
    }

    callback(null, false);
}