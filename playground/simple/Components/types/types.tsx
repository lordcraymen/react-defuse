type Topic = string | symbol

type withDEFUSE = {
	DEF?: Topic
	USE?: Topic
	[key: Topic]: unknown
}

export { type Topic, type withDEFUSE }