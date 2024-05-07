interface FormatOptions {
  removeNumbers?: boolean;
  removeSpecialCharacters?: boolean;
  all?: boolean;
}

export class FormatterUtils  {
  public static formatString(input: string, options: FormatOptions): string {
    let formattedString = input;
    if (options.removeNumbers || options.all) {
      formattedString = formattedString.replace(/\d/g, '');
    }
    if (options.removeSpecialCharacters || options.all) {
      formattedString = formattedString.replace(/[^\w\s]/g, '');
    }
    return formattedString.trim();
  }  
}