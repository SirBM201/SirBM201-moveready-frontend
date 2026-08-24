export type Experience={id:string;role:string;employer:string;location:string;start:string;end:string;achievements:string[]};
export type Education={id:string;qualification:string;school:string;location:string;year:string};
export type CareerDocument={
 kind:"resume"|"cover_letter";template:"classic"|"compact";title:string;
 fullName:string;headline:string;email:string;phone:string;location:string;linkedIn:string;
 summary:string;skills:string[];experiences:Experience[];education:Education[];certifications:string[];
 recipient:string;company:string;jobTitle:string;letterOpening:string;letterBody:string;letterClosing:string;
 truthConfirmed:boolean;updatedAt:string;
};
export const newId=()=>typeof crypto!=="undefined"&&"randomUUID"in crypto?crypto.randomUUID():`item-${Date.now()}-${Math.random()}`;
export const emptyCareerDocument=():CareerDocument=>({kind:"resume",template:"classic",title:"My professional resume",fullName:"",headline:"",email:"",phone:"",location:"",linkedIn:"",summary:"",skills:[],experiences:[{id:newId(),role:"",employer:"",location:"",start:"",end:"",achievements:[""]}],education:[{id:newId(),qualification:"",school:"",location:"",year:""}],certifications:[],recipient:"Hiring Manager",company:"",jobTitle:"",letterOpening:"I am writing to express my interest in this opportunity.",letterBody:"",letterClosing:"Thank you for considering my application. I would welcome the opportunity to discuss how my verified experience can support your team.",truthConfirmed:false,updatedAt:new Date().toISOString()});
export const lines=(value:string)=>value.split(/\r?\n/).map(x=>x.trim()).filter(Boolean);
export const safeFilename=(value:string)=>value.trim().replace(/[^a-z0-9]+/gi,"-").replace(/^-|-$/g,"").toLowerCase()||"moveready-document";
