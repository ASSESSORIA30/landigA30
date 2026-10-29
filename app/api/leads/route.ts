import {NextRequest,NextResponse} from 'next/server';
import {createClient} from '@supabase/supabase-js';
export const runtime='nodejs';
const permitted=new Set(['application/pdf','image/jpeg','image/png','image/webp']);
export async function POST(req:NextRequest){
 try{
  const url=process.env.SUPABASE_URL,key=process.env.SUPABASE_SERVICE_ROLE_KEY;
  if(!url||!key)return NextResponse.json({error:'El formulari encara no està activat. Contacta amb nosaltres per WhatsApp.'},{status:503});
  const form=await req.formData();const file=form.get('file'),name=String(form.get('name')||'').trim(),phone=String(form.get('phone')||'').trim(),email=String(form.get('email')||'').trim(),type=String(form.get('type')||'Llum'),marketing=form.get('marketing')==='true';
  if(!(file instanceof File)||!permitted.has(file.type)||file.size>8*1024*1024||file.size===0)return NextResponse.json({error:'Cal adjuntar una factura PDF o imatge de fins a 8 MB.'},{status:400});
  if(!name||name.length>150||!/^\+?[\d\s().-]{8,30}$/.test(phone)||!/^\S+@\S+\.\S+$/.test(email)||email.length>180||!['Llum','Gas','Llum i gas'].includes(type))return NextResponse.json({error:'Revisa les dades de contacte.'},{status:400});
  // Production: add CAPTCHA and rate limiting at edge/WAF. Only service-role credentials run on the server.
  const sb=createClient(url,key,{auth:{persistSession:false}});const id=crypto.randomUUID();const ext=file.type==='application/pdf'?'pdf':file.type==='image/png'?'png':file.type==='image/webp'?'webp':'jpg';const path=`${id}/factura.${ext}`;
  const {error:uploadError}=await sb.storage.from('factures').upload(path,await file.arrayBuffer(),{contentType:file.type,upsert:false});if(uploadError)throw uploadError;
  const {error}=await sb.from('leads').insert({id,name,phone,email,service_type:type,invoice_path:path,consent_marketing:marketing,consent_contact:true,source:'landing_lleida',status:'nou'});
  if(error){await sb.storage.from('factures').remove([path]);throw error;}
  return NextResponse.json({ok:true,id});
 }catch(e){console.error('Lead submission error',e);return NextResponse.json({error:'No s’ha pogut registrar la sol·licitud. Contacta per WhatsApp.'},{status:500})}
}
