export const clients = [
  { id: '01', name: 'دار وإعمار', logo: '/clients/01-شركة-دار-وإعمار.png' },
  { id: '02', name: 'شركة الصالح للمقاولات', logo: '/clients/02-شركة-الصالح-للمقاولات.png' },
  { id: '03', name: 'Gulf Consult', logo: '/clients/03-Gulf-Consult.png' },
  { id: '04', name: 'مكتب فارس الهندسي', logo: '/clients/04-مكتب-فارس-الهندسى.png' },
  { id: '05', name: 'Saudi Arabia Railways', logo: '/clients/05-خطوط-سكك-الحديد-السعودية-sar.png' },
  { id: '06', name: 'شركة مياه الشرب والصرف الصحي', logo: '/clients/06-شركة-مياة-الشرب-والصرف-الصحى.png' },
  { id: '07', name: 'نقابة المهندسين بالدقهلية', logo: '/clients/07-نقابة-المهندسين-بالدقهلية.png' },
  { id: '08', name: 'IDS Consulting', logo: '/clients/08-IDS-Consulting.png' },
  { id: '09', name: 'CAD Masters', logo: '/clients/09-Cad-Masters.png' },
  { id: '10', name: 'شركة الغانم للمقاولات', logo: '/clients/10-شركة-الغانم-للمقاولات.png' },
  { id: '11', name: 'Niqat', logo: '/clients/11-Niqat.png' },
  { id: '12', name: 'الأكاديمية الدولية للهندسة وعلوم الإعلام', logo: '/clients/12-الأكاديمية-الدولية-للهندسة-وعلوم-الإعلام.png' },
  { id: '13', name: 'Kayan Academy', logo: '/clients/13-Kayan-Academy.png' },
  { id: '14', name: 'Blue Ocean', logo: '/clients/14-Blue-Ocean.png' },
  { id: '15', name: 'UpSkill Center', logo: '/clients/15-Upskill-Center.png' },
  { id: '16', name: 'أكاديمية أوميجا للتدريب', logo: '/clients/16-أكاديمية-أوميجا-للتدريب.png' },
];


export const serviceClients = ['01', '02', '03', '04', '05', '10', '08', '13'].map((id) => {
  const client = clients.find((item) => item.id === id);
  if (!client) throw new Error(`Unknown client: ${id}`);
  return client;
});
