import {chromium} from 'playwright';
export async function openBrowser(){
  const args=['--enable-unsafe-swiftshader','--use-angle=swiftshader','--disable-dev-shm-usage'];
  return chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||undefined,args});
}
