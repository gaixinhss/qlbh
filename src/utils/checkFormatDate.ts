function isValidDateFormat(input: any): boolean {
  // Sử dụng regex để kiểm tra định dạng chuỗi
  const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/

  return dateFormatRegex.test(input)
}

export { isValidDateFormat }
