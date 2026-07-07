export function isDraft(id: string) {
	return id.startsWith("_");
}

export function parseDateFromId(id: string) {
	const [y, m, d] = id.split("-") as [string, string, string];

	return new Date(Number(y.replace("_", "")), Number(m) - 1, Number(d));
}

export function formatDate(date: Date) {
	const mm = String(date.getMonth() + 1).padStart(2, "0");
	const dd = String(date.getDate()).padStart(2, "0");
	return `${mm}/${dd}/${date.getFullYear()}`;
}

export function slicePreview(text: string, length: number) {
	if (text.length <= length) {
		if (text.endsWith(".")) return text + "..";
		return text + "...";
	}

	const cutIndex = text.lastIndexOf(" ", length);
	return cutIndex !== -1
		? text.slice(0, cutIndex) + "..."
		: text.slice(0, length) + "...";
}
