import { listMetadata, listPage } from '../routes';

export const revalidate = 300;
export const metadata = listMetadata('analysis');
export default listPage('analysis');
