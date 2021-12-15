/*
  From GraphQL query:
  {
    availableLocales {
      isoCode
      name
    }
  }
 */
const SHOP_LOCALES = [
  {
    "isoCode": "af",
    "name": "Afrikaans"
  },
  {
    "isoCode": "ak",
    "name": "Akan"
  },
  {
    "isoCode": "sq",
    "name": "Albanian"
  },
  {
    "isoCode": "am",
    "name": "Amharic"
  },
  {
    "isoCode": "ar",
    "name": "Arabic"
  },
  {
    "isoCode": "hy",
    "name": "Armenian"
  },
  {
    "isoCode": "as",
    "name": "Assamese"
  },
  {
    "isoCode": "az",
    "name": "Azerbaijani"
  },
  {
    "isoCode": "bm",
    "name": "Bambara"
  },
  {
    "isoCode": "bn",
    "name": "Bangla"
  },
  {
    "isoCode": "eu",
    "name": "Basque"
  },
  {
    "isoCode": "be",
    "name": "Belarusian"
  },
  {
    "isoCode": "bs",
    "name": "Bosnian"
  },
  {
    "isoCode": "br",
    "name": "Breton"
  },
  {
    "isoCode": "bg",
    "name": "Bulgarian"
  },
  {
    "isoCode": "my",
    "name": "Burmese"
  },
  {
    "isoCode": "ca",
    "name": "Catalan"
  },
  {
    "isoCode": "ce",
    "name": "Chechen"
  },
  {
    "isoCode": "zh-CN",
    "name": "Chinese (Simplified)"
  },
  {
    "isoCode": "zh-TW",
    "name": "Chinese (Traditional)"
  },
  {
    "isoCode": "cu",
    "name": "Church Slavic"
  },
  {
    "isoCode": "kw",
    "name": "Cornish"
  },
  {
    "isoCode": "hr",
    "name": "Croatian"
  },
  {
    "isoCode": "cs",
    "name": "Czech"
  },
  {
    "isoCode": "da",
    "name": "Danish"
  },
  {
    "isoCode": "nl",
    "name": "Dutch"
  },
  {
    "isoCode": "dz",
    "name": "Dzongkha"
  },
  {
    "isoCode": "en",
    "name": "English"
  },
  {
    "isoCode": "eo",
    "name": "Esperanto"
  },
  {
    "isoCode": "et",
    "name": "Estonian"
  },
  {
    "isoCode": "ee",
    "name": "Ewe"
  },
  {
    "isoCode": "fo",
    "name": "Faroese"
  },
  {
    "isoCode": "fi",
    "name": "Finnish"
  },
  {
    "isoCode": "fr",
    "name": "French"
  },
  {
    "isoCode": "ff",
    "name": "Fulah"
  },
  {
    "isoCode": "gl",
    "name": "Galician"
  },
  {
    "isoCode": "lg",
    "name": "Ganda"
  },
  {
    "isoCode": "ka",
    "name": "Georgian"
  },
  {
    "isoCode": "de",
    "name": "German"
  },
  {
    "isoCode": "el",
    "name": "Greek"
  },
  {
    "isoCode": "gu",
    "name": "Gujarati"
  },
  {
    "isoCode": "ha",
    "name": "Hausa"
  },
  {
    "isoCode": "he",
    "name": "Hebrew"
  },
  {
    "isoCode": "hi",
    "name": "Hindi"
  },
  {
    "isoCode": "hu",
    "name": "Hungarian"
  },
  {
    "isoCode": "is",
    "name": "Icelandic"
  },
  {
    "isoCode": "ig",
    "name": "Igbo"
  },
  {
    "isoCode": "id",
    "name": "Indonesian"
  },
  {
    "isoCode": "ia",
    "name": "Interlingua"
  },
  {
    "isoCode": "ga",
    "name": "Irish"
  },
  {
    "isoCode": "it",
    "name": "Italian"
  },
  {
    "isoCode": "ja",
    "name": "Japanese"
  },
  {
    "isoCode": "jv",
    "name": "Javanese"
  },
  {
    "isoCode": "kl",
    "name": "Kalaallisut"
  },
  {
    "isoCode": "kn",
    "name": "Kannada"
  },
  {
    "isoCode": "ks",
    "name": "Kashmiri"
  },
  {
    "isoCode": "kk",
    "name": "Kazakh"
  },
  {
    "isoCode": "km",
    "name": "Khmer"
  },
  {
    "isoCode": "ki",
    "name": "Kikuyu"
  },
  {
    "isoCode": "rw",
    "name": "Kinyarwanda"
  },
  {
    "isoCode": "ko",
    "name": "Korean"
  },
  {
    "isoCode": "ku",
    "name": "Kurdish"
  },
  {
    "isoCode": "ky",
    "name": "Kyrgyz"
  },
  {
    "isoCode": "lo",
    "name": "Lao"
  },
  {
    "isoCode": "lv",
    "name": "Latvian"
  },
  {
    "isoCode": "ln",
    "name": "Lingala"
  },
  {
    "isoCode": "lt",
    "name": "Lithuanian"
  },
  {
    "isoCode": "lu",
    "name": "Luba-Katanga"
  },
  {
    "isoCode": "lb",
    "name": "Luxembourgish"
  },
  {
    "isoCode": "mk",
    "name": "Macedonian"
  },
  {
    "isoCode": "mg",
    "name": "Malagasy"
  },
  {
    "isoCode": "ms",
    "name": "Malay"
  },
  {
    "isoCode": "ml",
    "name": "Malayalam"
  },
  {
    "isoCode": "mt",
    "name": "Maltese"
  },
  {
    "isoCode": "gv",
    "name": "Manx"
  },
  {
    "isoCode": "mi",
    "name": "Maori"
  },
  {
    "isoCode": "mr",
    "name": "Marathi"
  },
  {
    "isoCode": "mn",
    "name": "Mongolian"
  },
  {
    "isoCode": "ne",
    "name": "Nepali"
  },
  {
    "isoCode": "nd",
    "name": "North Ndebele"
  },
  {
    "isoCode": "se",
    "name": "Northern Sami"
  },
  {
    "isoCode": "no",
    "name": "Norwegian"
  },
  {
    "isoCode": "nb",
    "name": "Norwegian (Bokmål)"
  },
  {
    "isoCode": "nn",
    "name": "Norwegian Nynorsk"
  },
  {
    "isoCode": "or",
    "name": "Odia"
  },
  {
    "isoCode": "om",
    "name": "Oromo"
  },
  {
    "isoCode": "os",
    "name": "Ossetic"
  },
  {
    "isoCode": "ps",
    "name": "Pashto"
  },
  {
    "isoCode": "fa",
    "name": "Persian"
  },
  {
    "isoCode": "pl",
    "name": "Polish"
  },
  {
    "isoCode": "pt-BR",
    "name": "Portuguese (Brazil)"
  },
  {
    "isoCode": "pt-PT",
    "name": "Portuguese (Portugal)"
  },
  {
    "isoCode": "pa",
    "name": "Punjabi"
  },
  {
    "isoCode": "qu",
    "name": "Quechua"
  },
  {
    "isoCode": "ro",
    "name": "Romanian"
  },
  {
    "isoCode": "rm",
    "name": "Romansh"
  },
  {
    "isoCode": "rn",
    "name": "Rundi"
  },
  {
    "isoCode": "ru",
    "name": "Russian"
  },
  {
    "isoCode": "sg",
    "name": "Sango"
  },
  {
    "isoCode": "gd",
    "name": "Scottish Gaelic"
  },
  {
    "isoCode": "sr",
    "name": "Serbian"
  },
  {
    "isoCode": "sn",
    "name": "Shona"
  },
  {
    "isoCode": "ii",
    "name": "Sichuan Yi"
  },
  {
    "isoCode": "sd",
    "name": "Sindhi"
  },
  {
    "isoCode": "si",
    "name": "Sinhala"
  },
  {
    "isoCode": "sk",
    "name": "Slovak"
  },
  {
    "isoCode": "sl",
    "name": "Slovenian"
  },
  {
    "isoCode": "so",
    "name": "Somali"
  },
  {
    "isoCode": "es",
    "name": "Spanish"
  },
  {
    "isoCode": "su",
    "name": "Sundanese"
  },
  {
    "isoCode": "sw",
    "name": "Swahili"
  },
  {
    "isoCode": "sv",
    "name": "Swedish"
  },
  {
    "isoCode": "tg",
    "name": "Tajik"
  },
  {
    "isoCode": "ta",
    "name": "Tamil"
  },
  {
    "isoCode": "tt",
    "name": "Tatar"
  },
  {
    "isoCode": "te",
    "name": "Telugu"
  },
  {
    "isoCode": "th",
    "name": "Thai"
  },
  {
    "isoCode": "bo",
    "name": "Tibetan"
  },
  {
    "isoCode": "ti",
    "name": "Tigrinya"
  },
  {
    "isoCode": "to",
    "name": "Tongan"
  },
  {
    "isoCode": "tr",
    "name": "Turkish"
  },
  {
    "isoCode": "tk",
    "name": "Turkmen"
  },
  {
    "isoCode": "uk",
    "name": "Ukrainian"
  },
  {
    "isoCode": "ur",
    "name": "Urdu"
  },
  {
    "isoCode": "ug",
    "name": "Uyghur"
  },
  {
    "isoCode": "uz",
    "name": "Uzbek"
  },
  {
    "isoCode": "vi",
    "name": "Vietnamese"
  },
  {
    "isoCode": "vo",
    "name": "Volapük"
  },
  {
    "isoCode": "cy",
    "name": "Welsh"
  },
  {
    "isoCode": "fy",
    "name": "Western Frisian"
  },
  {
    "isoCode": "wo",
    "name": "Wolof"
  },
  {
    "isoCode": "xh",
    "name": "Xhosa"
  },
  {
    "isoCode": "yi",
    "name": "Yiddish"
  },
  {
    "isoCode": "yo",
    "name": "Yoruba"
  },
  {
    "isoCode": "zu",
    "name": "Zulu"
  }
].reduce((obj, locale) => ({ ...obj, [locale.isoCode]: locale.name }), {});

module.exports = {
  SHOP_LOCALES
};
