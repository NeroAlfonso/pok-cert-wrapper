const pokcert =require('@nerioalfonso/pok-cert-wrapper');
async function main()
{
    try
    {
        const student ={
            first_name: "Jhon",
            last_name: "Doe",
            email: "jd@mailinator.com",
            dni: "0000000000001"
        }
        const api_key ='<YOUR_POK_API_KEY_HERE>';
        const PokInstance =new pokcert.CertPok(api_key);
        
        const organization =await PokInstance.organization;
        console.log('organization from api key: ', organization);
        
        const templates =await PokInstance.templates(10);
        console.log('certificate templates:', templates);
        
        const template =await PokInstance.template(templates[3].id);
        console.log('template details:', template);
        
        const template_prev =await PokInstance.templatePreview(
            templates[3].id, 
            'pok', 
            '01/01/2025', 
            'Course name', 
            student.first_name, 
            student.last_name
        );
        console.log('template preview pok:', template_prev);

        const template_prev_bc =await PokInstance.templatePreview(
            templates[3].id, 
            'blockchain', 
            '01/01/2025', 
            'Course name', 
            student.first_name, 
            student.last_name
        );
        console.log('template preview blockchain:', template_prev_bc);
        
        const pages =await PokInstance.pages(10);
        console.log('certificated pages:', pages);

        const credential =await PokInstance.emitCredential(
            templates[3].id, 
            'pok' /*'blockchain'*/,           
            '01/01/2025',           
            'Course name',    
            student.first_name, 
            student.last_name,
            [
                'student_id', 
                'studygroup_id', 
                'organization_id', 
                'other'
            ], 
            student.dni, 
            student.email, 
            pages[0].id, 
            'es-AR', 
            organization.name
        );
        console.log('credential pok:', credential);
        
        const credential_status =await PokInstance.credential(credential.id);
        console.log('credential status:', credential_status);

        const credential_image =await PokInstance.credentialImageUrl(credential.id);
        console.log('credential image:', credential_image);
    }
    catch(e)
    {
        console.log(e)
        console.log('error')
    }  
}
main();
