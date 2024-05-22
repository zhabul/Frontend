 




 export const generateEmailInfoObject = (data, id) => {
   return {
     to: data.to,
     from:  data.from,
     name: data.name,
     header: data.header,
     footer: data.footer,
     manualReply: data.manualReply,
     status: data.status,
     reminder: data.reminder,
     id: id,
     comment: data.comment
   };
 }