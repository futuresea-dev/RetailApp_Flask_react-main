import json
class Base(object):
  data = {}
  allow_fields = {}

  def __getattr__(self, name):
    if name in self.data.keys():
      return self.data[name]
    else:
      return super().__getattr__(name)

  def __setattr__(self, name, value):
    if name in self.allow_fields:
      self.data[name] = value
    else:
      super().__setattr__(name, value)

  @classmethod
  def get_select_fields(self):
    return ', '.join([f'"{field_name}"' for field_name in self.allow_fields.values()])


