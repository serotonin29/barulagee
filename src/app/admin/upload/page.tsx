import { MainLayout } from '@/components/layout/main-layout';
import { UploadMaterialForm } from '@/components/admin/upload-material-form';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function UploadMaterialPage() {
  return (
    <MainLayout pageTitle="Upload Materi Baru">
        <Card>
            <CardHeader>
                <CardTitle>Formulir Upload Materi</CardTitle>
                <CardDescription>
                    Isi detail di bawah ini untuk menambahkan materi pembelajaran baru ke sistem.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <UploadMaterialForm />
            </CardContent>
        </Card>
    </MainLayout>
  );
}
