'use strict'
const path = require('path')
const dayInMilli = 24 * 60 * 60 * 1000

module.exports = {
	tasktype: {
		translation: 1,
		modification: 2,
		validation: 3
	},
	status: {
		ok: 1,
		null: 0
	},
	tasklimit: {
		translation: 5,
		modification: 3,
		validation: 5
	},
	exp_days: 2,
	taskstate: {
		ongoing: false,
		terminated: true
	},
	gapState: {
		isgap: true,
		notgap: false
	},
	ub_ids: [
		161, 119, 124, 129, 15355, 127, 145, 138,
		131, 123, 40, 132, 83505, 121, 61558, 118, 120,
		143, 139, 28162, 142, 133, 130, 122, 134
	],
	interval: 1 * dayInMilli,
	languageCodes: [
		'en', 'in', 'it', 'es', 'zh'
	],
	msg: {
		mn: {
			generated: {
				ok: "Амжилттай генерацлагдаж дууслаа!",
				null: "Генерацлах үйл ажиллагаа амжилтгүй боллоо, алдаа шалгаад дахин оролдоно уу!",
				end: "Энэ айн бүх даалгавруудыг үүсгэсэн байна. Сая үүсгэсэн: ",
				nodef: " параметрийг тодорхойлж өгөөгүй байна!",
				limit: " даалгаврын хязгаар хүрлээ. Үүсгэсэн даалгавар: ",
				desc: "Энэ оройн бүх хүүхдийн даалгавар үүсгэгдлээ! Дараагийн хүүхэд рүү шилжиж байна! Үүссэн: "
			},
			task: {
				unavailable: "Энэ айд таны сонгосон төрлийн идэвхитэй даалгавар байхгүй байна, өөр айд шилжинэ үү!"
			},
			transaved: {
				ok: "Орчуулгыг амжилттай хадгаллаа! Таны хувь нэмэрт талархлаа!",
				null: "Орчуулгыг хадгалахад алдаа гарлаа!"
			},
			modsaved: {
				ok: "Засварлалтын даалгаврын хувь нэмэр амжилттай хадгалагдлаа!",
				null: "Засварлалтын өгөгдлийг хадгалахад алдаа гарлаа, дахин хянана уу!"
			},
			truncated: {
				ok: "Коллекцийг хоослож дууслаа!",
				null: "Коллекцийг хоослоход алдаа гарлаа, хянана уу!"
			},
			user: {
				changeuname: " оролцогч бүртгэлтэй байна. Өөр нэр сонгоно уу!",
				register: {
					ok: "Оролцогч амжилттай бүртгэгдлээ!",
					null: "Оролцогчийг бүртгэх боломжгүй байна!"
				},
				auth: {
					notfound: "Оролцогч олдсонгүй!",
					wpass: "Нууц үг буруу байна!"
				}
			},
			validsaved: {
				ok: "Үнэлгээ амжилттай хадгалагдлаа! Баярлалаа!",
				null: "Үнэлгээг хадгалахад алдаа гарлаа! Дахин хянана уу!"
			}
		},
		en: {
			generated: {
				ok: "Generation has successfully been carried out!",
				null: "The generation step has failed to succeed, revise it again and retry!",
				end: "Every task has been created in this domain. Currently organized: ",
				nodef: " is not defined!",
				limit: " of task limit has been reached. Currently organized: ",
				desc: "Tasks for the current vertice have completely organized! Proceeding to shift to the next vertice! Organized: "
			},
			task: {
				unavailable: "There is no available task with respect to the task type in this domain, move to another one please!"
			},
			transaved: {
				ok: "Translation saved successfully! Thanks for your collaboration!",
				null: "There is an error saving the translation!"
			},
			modsaved: {
				ok: "Your contribution to the modification task saved successfully! Thank you!",
				null: "Modification run data not saved properly!"
			},
			truncated: {
				ok: "Entire collection truncated!",
				null: "Collection not truncated properly, revise it!"
			},
			user: {
				changeuname: " username has already been registered, please try another one!",
				register: {
					ok: "Participant successfully registered!",
					null: "There is an issue registering the participant!"
				},
				auth: {
					notfound: "This user is not found!",
					wpass: "Incorrect password or username!"
				}
			},
			validsaved: {
				ok: "Validation run successfully saved, thank you!",
				null: "Validation not saved properly!"
			}
		}
	}
}
