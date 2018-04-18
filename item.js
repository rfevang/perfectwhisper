class Item {
  constructor(data) {
    this.itemId_ = data.itemId || data.ItemId;
    this.stackCount_ = data.stackCount || data.StackCount;
    this.category = data.category || data.Category;
    this.subCategory = data.subCategory || data.SubCategory;
    this.attachedItems_ = data.attachedItems || data.AttachedItems;
  }
}
