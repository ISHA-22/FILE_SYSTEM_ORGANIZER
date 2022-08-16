#!/usr/bin/env node

//this statement tells in which env this script must run i.e node
// shebang syntax
//TO IMPLEMENT

//tree[] ...............node main.js tree "directoryPath"

//organize[]........... node main.js organize "directoryPath"
//ORGANIZE : will organize all the files in a folder according to different catergories mentioned in utility.js
//                    organized files will be a part of a new folder created but will not delete original files

//help[]................ node main.js help 



//taking command line input
//process.argv[0]=node
//process.argv[1]=file name ..from 2 the user input starts 
//after 2 slicing will start

let inputArr = process.argv.slice(2);
let fs=require("fs"); //module 
let path=require("path"); //module

let types = //object
{
    media: ["mp4","mkv"],
    archives: ["zip","rar","tar","gz","ar",'iso','xz'],
    documents: ["pdf","docx","doc",'xlsx','xls','odt','ods','odp','odg','odf','txt','ps','tex'],
    app: ['exe','dmg','pkg','deb']

}
let command=inputArr[0];
switch(command)
{
    case "tree":
         treeFn(inputArr[1]);
         break;
    case "organize":
         organizeFn(inputArr[1]);
         break;
    case "help":
         helpFn();
         break;
    default: console.log("Please Input Right Command");
         break;
}
function treeFn(dirPath)
{
    console.log("Tree command implemented for", dirPath);
    
    if(dirPath==undefined)
    {
        
        treeHelper(process.cwd(),"");
        return;
    }
    else
    {
        //to check whether a given path exist or not 
        let doesExist = fs.existsSync(dirPath);
        if(doesExist)
        {
           treeHelper(dirPath,"");
        }
        else
        {
          console.log("Please enter a valid path");
          return;
        }
    }
}
function treeHelper(dirPath,indent)//printing the contents of a path in a tree format
{
    //find is a file or a folder,if a folder go within ,if a file just print
    let isFile= fs.lstatSync(dirPath).isFile();
    if(isFile==true)
    {
      let fileName= path.basename(dirPath);
      console.log(indent +"|-" + fileName);
    }
    else
    {
        let dirName= path.basename(dirPath);//a directory or a folder
        console.log(indent +"|___" + dirName);
        let childrens = fs.readdirSync(dirPath);
        for(let i=0;i<childrens.length;i++)//tree
        {
            let childPath= path.join(dirPath,childrens[i]);
            treeHelper(childPath,indent + "\t");
        }
    }

}
function organizeFn(dirPath)
{
   

    let destPath;
    if(dirPath==undefined)
    {
      
        destPath= process.cwd();
        return;
    }
    else
    {
        //to check whether a given path exist or not 
        let doesExist = fs.existsSync(dirPath);
        if(doesExist)
        {
            //start organizing
            //create a directory named : organized_files
            destPath= path.join(dirPath,"organized_files"); //wil add organized_files to end of directory name
            if(fs.existsSync(destPath)==false)
            //if folder already created when the code is run again it will throw error
            //therefore if folder doesnt exist only then create  organized_files 

            {fs.mkdirSync(destPath);}//create directory 
         
        }
        else
        {
            console.log("Please enter a correct path");
            return;
        }
    }
  
    organizeHelper(dirPath,destPath);  
    
}
function organizeHelper(src, dest)
{
    //3. identify categories of all files present in i/p directory
    let childNames= fs.readdirSync(src);//read file names 
    
    for(let i=0;i<childNames.length;i++)
    {
        let childAddr=path.join(src,childNames[i]);
        let isFile= fs.lstatSync(childAddr).isFile();//checks file or folder
        if(isFile)
        {
          
           let category= getCategory(childNames[i]);
           console.log(childNames[i]," belong to category ", category);
            //step:  copy childAddr files dest directory inside belonging category folder
            
           sendFiles(childAddr,dest,category);
        }
    }


}
function sendFiles(srcFilePath,dest,category)
{
    let categoryPath=path.join(dest,category);
    if(fs.existsSync(categoryPath)==false) //if folder does not exist then create it
    {
        fs.mkdirSync(categoryPath);
    }
    let fileName=path.basename(srcFilePath);
    let destFilePath=path.join(categoryPath,fileName);//empty file created
    fs.copyFileSync(srcFilePath,destFilePath);//copy contents of one file to above empty file created(paths are mentioned)
    
    //fs.unlinkSync(srcFilePath);
    //deleting orginal file usingunlinkSync
    
    console.log(fileName," copied to ",category);

}
function getCategory(name)
{
    let ext= path.extname(name);//will give extension with a dot
    //remove the dot from extension name
    ext=ext.slice(1);
    for(let type in types)
    {
        let cTypeArr=types[type]; //will include every type of array
        for(let i=0;i<cTypeArr.length;i++)
        {
            if(ext==cTypeArr[i])
            {
                return type;
            }
        }
        
    }
    return "others";
    
}
function helpFn()
{
    console.log(`List of all the commands
                    1. node main.js tree "directoryPath"
                    2. node main.js organize "directoryPath"
                    3. node main.js help 
                    `); //` ` is used to give multiple line string
}