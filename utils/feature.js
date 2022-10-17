class Feature {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }
  Search() {
    const search = this.queryStr.search
      ? {
          name: {
            $regex: new RegExp(this.queryStr.search),
            $options: "i",
          },
        }
      : {};

    this.query = this.query.find({ ...search });
    return this;
  }

  Filter() {
    // const queryCopy = { ...this.queryStr };

    // //Removing some of the field for filter
    // const removeField = ["search", "page", "limit"];

    // removeField.forEach((key) => delete queryCopy[key]);

    if (this.queryStr.gender) {
      switch (typeof this.queryStr.gender) {
        case "string":
          // console.log("string", this.queryStr);
          this.query = this.query.find({
            genders: {
              $elemMatch: {
                $or: [{ gender: this.queryStr.gender }],
              },
            },
          });
          break;

        case "object":
          const genderArray = this.queryStr.gender?.map((item) => {
            return { gender: item };
          });

          // console.log("object", this.queryStr);////comment
          this.query = this.query.find({
            genders: {
              $elemMatch: {
                $or: genderArray,
              },
            },
          });
          break;
        default:
          console.log("invalid but not work ");
          this.query = this.query;
      }
    }

    // filtering using color variant
    if (this.queryStr.color) {
      switch (typeof this.queryStr.color) {
        case "string":
          // console.log("string", this.queryStr);
          this.query = this.query.find({
            variant: {
              $elemMatch: {
                colors: {
                  $elemMatch: {
                    $or: [{ color: this.queryStr.color }],
                  },
                },
              },
            },
          });
          break;

        case "object":
          const colorArray = this.queryStr.color?.map((item) => {
            return { color: item };
          });

          // console.log("object", this.queryStr);////comment
          this.query = this.query.find({
            variant: {
              $elemMatch: {
                colors: {
                  $elemMatch: {
                    $or: colorArray,
                  },
                },
              },
            },
          });
          break;
        default:
          console.log("invalid but not work ");
          this.query = this.query;
      }
    }

    // Filtering with sizes

    if (this.queryStr.size) {
      switch (typeof this.queryStr.size) {
        case "string":
          console.log("string", this.queryStr);
          this.query = this.query.find({
            variant: {
              $elemMatch: {
                $or: [{ size: this.queryStr.size }],
              },
            },
          });
          break;

        case "object":
          const sizeArray = this.queryStr.size?.map((item) => {
            return { size: item };
          });

          console.log("object", this.queryStr); ////comment
          this.query = this.query.find({
            variant: {
              $elemMatch: {
                $or: sizeArray,
              },
            },
          });
          break;
        default:
          console.log("invalid but not work ");
          this.query = this.query;
      }
    }

    // /filtering using  categories

    if (this.queryStr.category) {
      switch (typeof this.queryStr.category) {
        case "string":
          // console.log("string", this.queryStr);
          this.query = this.query.find({
            categories: {
              $elemMatch: {
                $or: [{ category: this.queryStr.category }],
              },
            },
          });
          break;

        case "object":
          const categoryArray = this.queryStr.category?.map((item) => {
            return { category: item };
          });

          // console.log("object", this.queryStr);////comment
          this.query = this.query.find({
            categories: {
              $elemMatch: {
                $or: categoryArray,
              },
            },
          });
          break;
        default:
          console.log("invalid but not work ");
          this.query = this.query;
      }
    }

    //Filter Product using price

    if (this.queryStr.MrpPrice) {
      console.log(this.queryStr.MrpPrice);
      let queryStr = JSON.stringify(this.queryStr.MrpPrice);
      queryStr = queryStr.replace(
        /\b(gt|gte|lt|lte)\b/g,
        (keyValue) => `$${keyValue}`
      );
      queryStr = JSON.parse(queryStr);
      this.query = this.query.find({ MrpPrice: queryStr });
    }

    return this;
  }

  //pagination
}

module.exports = Feature;
