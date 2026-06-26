export function getImageFileExtension(file: File) {
	if (file.type === 'image/webp') return 'webp';
	return file.name.split('.').pop() || 'webp';
}
