const MAX_IMAGE_DIMENSION_PX = 1200;
const WEBP_QUALITY = 0.82;

function getResizedDimensions(width: number, height: number) {
	if (width <= MAX_IMAGE_DIMENSION_PX && height <= MAX_IMAGE_DIMENSION_PX) {
		return { width, height };
	}

	const ratio = Math.min(
		MAX_IMAGE_DIMENSION_PX / width,
		MAX_IMAGE_DIMENSION_PX / height
	);

	return {
		width: Math.round(width * ratio),
		height: Math.round(height * ratio)
	};
}

function loadImage(file: File) {
	return new Promise<HTMLImageElement>((resolve, reject) => {
		const image = new Image();
		const objectUrl = URL.createObjectURL(file);

		image.onload = () => {
			URL.revokeObjectURL(objectUrl);
			resolve(image);
		};

		image.onerror = () => {
			URL.revokeObjectURL(objectUrl);
			reject(new Error('이미지를 불러오지 못했어요.'));
		};

		image.src = objectUrl;
	});
}

function replaceExtension(fileName: string, extension: string) {
	const baseName = fileName.replace(/\.[^/.]+$/, '');
	return `${baseName}.${extension}`;
}

export async function optimizeImage(file: File) {
	if (!file.type.startsWith('image/') || file.type === 'image/gif') {
		return file;
	}

	const image = await loadImage(file);
	const { width, height } = getResizedDimensions(image.width, image.height);
	const canvas = document.createElement('canvas');
	canvas.width = width;
	canvas.height = height;

	const context = canvas.getContext('2d');
	if (!context) {
		throw new Error('이미지를 최적화하지 못했어요.');
	}

	context.drawImage(image, 0, 0, width, height);

	const blob = await new Promise<Blob>((resolve, reject) => {
		canvas.toBlob(
			blob => {
				if (!blob) {
					reject(new Error('이미지 변환에 실패했어요.'));
					return;
				}

				resolve(blob);
			},
			'image/webp',
			WEBP_QUALITY
		);
	});

	return new File([blob], replaceExtension(file.name, 'webp'), {
		type: 'image/webp'
	});
}
