export function fullNameValidator(name) {
    if (!name.trim()) return "Name can't be empty."
    if(!name.trim().split(" ") || name.trim().split(" ").length < 2)
        return "Please enter your full name"
    return ''
  }
  