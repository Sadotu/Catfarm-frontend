import { File, FileCsv, FileDoc, FileCode, FileJpg, FilePng, FilePdf, FilePpt, FileText, FileZip, FileXls, FileSvg, FileAudio, FileVideo } from '@phosphor-icons/react';

export const iconHelper = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();

    switch (extension) {
        case 'html':
        case 'css':
        case 'java':
        case 'js':
        case 'sql':
            return <FileCode size={32} />
        case 'csv':
            return <FileCsv size={32} />
        case 'pdf':
            return <FilePdf size={32} />
        case 'jpg':
        case 'jpeg':
            return <FileJpg size={32} />
        case 'png':
            return <FilePng size={32} />
        case 'svg':
            return <FileSvg size={32} />
        case 'doc':
        case 'docx':
            return <FileDoc size={32} />;
        case 'ppt':
        case 'pptx':
            return <FilePpt size={32} />
        case 'xls':
        case 'xlsx':
            return <FileXls size={32} />
        case 'zip':
        case 'rar':
            return <FileZip size={32} />
        case 'mp3':
        case 'wav':
            return <FileAudio size={32} />
        case 'mp4':
        case 'avi':
            return <FileVideo size={32} />
        case 'txt':
            return <FileText size={32} />
        default:
            return <File size={32} />;
    }
};