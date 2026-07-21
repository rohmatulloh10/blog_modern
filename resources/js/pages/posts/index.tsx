import { Head, useForm } from '@inertiajs/react';
import {
    Ellipsis,
    Pencil,
    Trash2,
} from 'lucide-react';
import { useState } from 'react';
import CKEditorComponent from '@/components/editor/ckeditor';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';

import { Label } from '@/components/ui/label';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';


import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';


const breadcrumbs = [
    {
        title: 'Artikel',
        href: '/posts',
    },
];
type Post = {
    id: number;
    title: string;
    slug: string;
    thumbnail: string;
    content: string;
    created_at: string;
    updated_at: string;
    category: {
        id: number;
        name: string;
    };
};
type Category = {
    id: number;
    name: string;
};
type Props = {
    posts: Post[];
    categories: Category[];
};

export default function Index({
    posts,
    categories,
}: Props) {
    const [editingPost, setEditingPost] =
        useState<Post | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const {
        data,
        setData,
        post,
        put,
        delete: destroy,
        processing,
        reset,
        errors,
    } = useForm({
        category_id:
            editingPost?.category.id.toString() || '',
        title:
            editingPost?.title || '',
        content: '',
    });

    const resetForm = () => {
        reset();
        setEditingPost(null);
        setData({ category_id: '', title: '', content: '' });
    };

    return (
        <>
            <Head title="Artikel" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">

                <Card>

                    <CardHeader className="flex flex-row items-center justify-between">

                        <CardTitle>
                            Daftar Artikel
                        </CardTitle>

                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button
                                    onClick={() => {
                                        resetForm();
                                        setIsDialogOpen(true);
                                    }}
                                >
                                    Tambah Artikel
                                </Button>
                            </DialogTrigger>

                            <DialogContent className="sm:max-w-3xl">
                                <DialogHeader>
                                    <DialogTitle>
                                        {editingPost
                                            ? 'Ubah Artikel'
                                            : 'Tambah Artikel'}
                                    </DialogTitle>
                                </DialogHeader>

                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();

                                        const options = {
                                            onSuccess: () => {
                                                reset();
                                                setEditingPost(null);
                                                setIsDialogOpen(false);
                                            },
                                        };

                                        if (editingPost) {

                                            put(
                                                `/posts/${editingPost.id}`,
                                                options
                                            );

                                        } else {

                                            post('/posts', options);

                                        }
                                    }}
                                    className="space-y-4"
                                >
                                    <div className="space-y-2">
                                        <Label>Kategori</Label>

                                        <Select
                                            value={data.category_id}
                                            onValueChange={(value) =>
                                                setData('category_id', value)
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih kategori" />
                                            </SelectTrigger>

                                            <SelectContent>
                                                {categories.map((category) => (
                                                    <SelectItem
                                                        key={category.id}
                                                        value={category.id.toString()}
                                                    >
                                                        {category.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Judul Artikel</Label>

                                        <Input
                                            value={data.title}
                                            onChange={(e) =>
                                                setData('title', e.target.value)
                                            }
                                            placeholder="Masukkan judul artikel"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Isi Artikel</Label>
                                        <CKEditorComponent
                                            value={data.content}
                                            onChange={(htmlValue) => setData('content', htmlValue)}
                                        />
                                        {errors.content && (
                                            <p className="text-sm text-red-500">{errors.content}</p>
                                        )}
                                    </div>

                                    <DialogFooter>
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                        >

                                            {editingPost
                                                ? 'Perbarui'
                                                : 'Simpan'}

                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>

                    </CardHeader>

                    <CardContent>

                        <Table>

                            <TableHeader>

                                <TableRow>

                                    <TableHead>
                                        Thumbnail
                                    </TableHead>

                                    <TableHead>
                                        Judul
                                    </TableHead>

                                    <TableHead>
                                        Kategori
                                    </TableHead>

                                    <TableHead>
                                        Tanggal Upload
                                    </TableHead>
                                    <TableHead>
                                        Tanggal Edit
                                    </TableHead>

                                    <TableHead className="text-right">
                                        Aksi
                                    </TableHead>

                                </TableRow>

                            </TableHeader>

                            <TableBody>

                                {posts.length > 0 ? (

                                    posts.map((post) => (

                                        <TableRow key={post.id}>

                                            <TableCell>
                                                -
                                            </TableCell>

                                            <TableCell>
                                                {post.title}
                                            </TableCell>

                                            <TableCell>
                                                {post.category.name}
                                            </TableCell>

                                            <TableCell>
                                                {post.created_at}
                                            </TableCell>

                                            <TableCell>
                                                {post.updated_at}
                                            </TableCell>

                                            <TableCell className="text-right">

                                                <DropdownMenu>

                                                    <DropdownMenuTrigger asChild>

                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                        >
                                                            <Ellipsis className="h-4 w-4" />
                                                        </Button>

                                                    </DropdownMenuTrigger>

                                                    <DropdownMenuContent align="end">

                                                        <DropdownMenuItem
                                                            onSelect={(e) => {
                                                                e.preventDefault(); // Mencegah dropdown menutup paksa dialog
                                                                setEditingPost(post);
                                                                setData({
                                                                    category_id: post.category.id.toString(),
                                                                    title: post.title,
                                                                    content: post.content || '',
                                                                });
                                                                setIsDialogOpen(true); // Buka modal
                                                            }}
                                                        >

                                                            <Pencil className="mr-2 h-4 w-4" />

                                                            <span>Edit</span>

                                                        </DropdownMenuItem>

                                                        <AlertDialog>

                                                            <AlertDialogTrigger asChild>

                                                                <DropdownMenuItem
                                                                    onSelect={(e) => e.preventDefault()}
                                                                    className="text-destructive focus:text-destructive"
                                                                >
                                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                                    <span>Hapus</span>
                                                                </DropdownMenuItem>

                                                            </AlertDialogTrigger>

                                                            <AlertDialogContent>

                                                                <AlertDialogHeader>

                                                                    <AlertDialogTitle>
                                                                        Hapus Artikel?
                                                                    </AlertDialogTitle>

                                                                    <AlertDialogDescription>
                                                                        Artikel yang telah dihapus tidak dapat dikembalikan kembali.
                                                                    </AlertDialogDescription>

                                                                </AlertDialogHeader>

                                                                <AlertDialogFooter>

                                                                    <AlertDialogCancel>
                                                                        Batal
                                                                    </AlertDialogCancel>

                                                                    <AlertDialogAction
                                                                        onClick={() =>
                                                                            destroy(`/posts/${post.id}`)
                                                                        }
                                                                    >
                                                                        Hapus
                                                                    </AlertDialogAction>

                                                                </AlertDialogFooter>

                                                            </AlertDialogContent>

                                                        </AlertDialog>

                                                    </DropdownMenuContent>

                                                </DropdownMenu>

                                            </TableCell>

                                        </TableRow>

                                    ))

                                ) : (

                                    <TableRow>

                                        <TableCell
                                            colSpan={5}
                                            className="text-center"
                                        >
                                            Belum ada data artikel.
                                        </TableCell>

                                    </TableRow>

                                )}

                            </TableBody>

                        </Table>

                    </CardContent>

                </Card>

            </div>

        </>
    );
}

Index.layout = (
    page: React.ReactNode
) => (
    <AppLayout breadcrumbs={breadcrumbs}>
        {page}
    </AppLayout>
);