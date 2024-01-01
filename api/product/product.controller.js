const {
  addProduct,
  getAllProducts,
  getProductandVariantsById,
  updateProductById,
  deleteProductById,
  deleteAllProducts,
  getProductsByCategoryId,
  getProductsByCollectionId,
  getProductsPerPage,
  countProducts,
  uploadProductImages,
  getAllVariantsAndItsValues,
  addVariant,
  addVariantValues,
  addProductVariants,
  searchProductVariant,
  getProductBySKU,
  getProductWithoutVariantsById,
  isProductHasVariants,
  deleteVariantsByProductId,
  searchAndAddVariantValue,
} = require("./product.service");
// const { hashSync, genSaltSync, compareSync } = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { isAdmin } = require("../../auth/token_validation");

module.exports = {
  // addProduct: (req, res) => {
  //   const body = req.body;
  //   addProduct(body)
  //     .then((product) => {
  //       return res.status(200).json({
  //         success: 1,
  //         data: product,
  //       });
  //     })
  //     .catch((err) => {
  //       return res.status(500).json({
  //         success: 0,
  //         message: "Database connection errror",
  //         error: err,
  //       });
  //     });
  //     body.variants.forEach((variant) => {
  //       if (variant.id == null) {
  //         addVariant(variant.name)
  //           .then((varint) => {
  //             console.log("variant added", variant.name);
  //             addVariantValues(varint.insertId, variant.values)
  //               .then((vals) => {
  //                 console.log(
  //                   "variant values added",
  //                   variant.name,
  //                   variant.values
  //                 );
  //               })
  //               .catch((error) => {
  //                 return res.status(500).json({
  //                   success: 0,
  //                   message: "Database connection errror",
  //                   error: error,
  //                 });
  //               });
  //           })
  //           .catch((error) => {
  //             return res.status(500).json({
  //               success: 0,
  //               message: "Database connection errror",
  //               error: error,
  //             });
  //           });
  //       } else {
  //         addVariantValues(variant.id, variant.values)
  //           .then((val) => {
  //             console.log(
  //               "variant values added",
  //               variant.name,
  //               variant.values
  //             );
  //           })
  //           .catch((error) => {
  //             return res.status(500).json({
  //               success: 0,
  //               message: "Database connection errror",
  //               error: error,
  //             });
  //           });
  //       }
  //     });
  // },
  addProduct: (req, res) => {
    const body = req.body
    console.log("body is", body);
    body.collection_id=parseInt(body.collection_id)
    console.log("array is", body.variants);
    const promises = [];
    var InsertedId = 0;
    getProductBySKU(body.sku, body.variants == null ? 0 : 1)
      .then((result) => {
        // if (body.variants) {
        console.log("sku1");
        promises.push(
          addProduct(body).then((product) => {
            InsertedId = product.insertId;
            console.log("product", product);
            console.log("product added suuceesfully");
            if (body.variants)
                return addProductVariants(product.insertId, body.combinations)
            
          })
          // .catch((err) => {
          //   console.log("product not added suuceesfully")
          //   return err;
          // })
        );
        if (body.variants) {
          body.variants.forEach((variant) => {
            if (variant.id == null) {
              promises.push(
                addVariant(variant.name).then((varint) => {
                  return addVariantValues(varint.insertId, variant.values);
                })
                // .catch((err) => {
                //   return err;
                // })
              );
            } else {
              promises.push(
                searchAndAddVariantValue(variant.id, variant.values)
              );
            }
            // else {
            //   promises.push(addVariantValues(variant.id, variant.values));
            // }
          });
        }
        console.log("in promise", promises);
        Promise.all(promises)
          .then((results) => {
            console.log("first promise");
            console.log("first promise results",results);
            if (body.variants) {
              console.log("teh inserted first promise",results[0].insertId)
              searchProductVariant(
                results[0].insertId,
                results[0].affectedRows,
                body.combinations
              )
                .then((result) => {
                  console.log(result);
                  return res.status(200).json({
                    success: 1,
                    message: "Product and its variants added Successfully",
                    result: result,
                    InsertedId: InsertedId,
                  });
                })
                .catch((err) => {
                  return res.status(500).json({
                    success: 0,
                    message: "Didnt added",
                    error: err,
                  });
                });
            } else {
              return res.status(200).json({
                success: 1,
                message: "Product added Successfully",
                result: results,
                InsertedId: InsertedId,
              });
            }
          })
          .catch((error) => {
            return res.status(500).json({
              success: 0,
              message: "Databasee connection errror",
              errror: error,
            });
          });
      })
      .catch((err) => {
        res.json({
          success: 0,
          message: "SKU Should be unique",
          error: err,
        });
      });
  },
  getProductById: (req, res) => {
    const id = req.params.id;
    isProductHasVariants(id, (err, result) => {
      if (err) {
        return res.status(500).json({
          success: 0,
          message: "Database connection errror",
          error: err,
        });
      }
      if (!result) {
        return res.json({
          success: 0,
          message: "Record not Found",
        });
      }
      console.log(result, "variant has");
      if (result.has_variant) {
        getProductandVariantsById(id, (err, product_results) => {
          if (err) {
            console.log(err);
            return res.status(500).json({
              success: 0,
              message: "Database connection errror",
              error: err,
            });
          }
          if (!product_results) {
            return res.json({
              success: 0,
              message: "Record not Found",
            });
          }
          console.log("results",product_results)
          var variants = [];
          let images_arr=[]
          if(product_results[0].image_paths)
            images_arr=product_results[0].image_paths.split(",");
          var images=[]
          var combinations = [];
          var tempCombinations = product_results[0].combinations.split(" ");
          // images_arr.forEach((result) => {
          //   images.push({
          //     id: result.variant_id,
          //     path: result.variant_name,
          //     values: result.variant_values.split(","),
          //   });
          // });
          product_results.forEach((result) => {
            variants.push({
              id: result.variant_id,
              name: result.variant_name,
              values: result.variant_values.split(","),
            });
          });
          console.log(tempCombinations);
          tempCombinations.forEach((combination) => {
            let j = "{" + combination + "}";
            j = j.replace(/'/g, '"');
            j = JSON.parse(j);
            combinations.push(j);
          });
          console.log("quantity",product_results[0].stock_quantity)
          var json = {
            name: product_results[0].product_name,
            // supplier_id: product_results[0].supplier_id,
            // category_id: product_results[0].category_id,
            collection_id: product_results[0].collection_id,
            product_description: product_results[0].product_description,
            price:product_results[0].price,
            quantity:product_results[0].quantity,
            sku:product_results[0].sku,
            variants: variants,
            combinations: combinations,
            images:images_arr
          };
          return res.json({
            success: 1,
            data: json,
          });
        });
      } else {
        getProductWithoutVariantsById(id, (err, results) => {
          if (err) {
            console.log(err);
            return res.status(500).json({
              success: 0,
              message: "Database connection errror",
              error: err,
            });
          }
          if (!results) {
            return res.json({
              success: 0,
              message: "Record not Found",
            });
          } else {
           
            console.log("results",results)
            var variants = [];
            let images_arr=[]
            if(results[0].image_paths)
              images_arr=results[0].image_paths.split(",");
            var images=[]
            var combinations = [];
           
            var json = {
              name: results[0].product_name,
              // supplier_id: results[0].supplier_id,
              // category_id: results[0].category_id,
              collection_id: results[0].collection_id,
              price:results[0].price,
              product_description: results[0].product_description,
              quantity: results[0].quantity,
              sku: results[0].sku,
              variants: variants,
              combinations: combinations,
              images:images_arr
            };



            return res.json({
              success: 1,
              message: "this",
              data: json,
            });
          }
        });
      }
    });
  },
  getAllProducts: (req, res) => {
    getAllProducts((err, results) => {
      if (err) {
        return res.status(500).json({
          success: 0,
          message: "Database connection errror",
          error: err,
        });
      }
      return res.json({
        success: 1,
        data: results,
      });
    });
  },
  getProductsPerPage: (req, res) => {
    console.log('page',req.params.id);
    // const page = parseInt(req.query.page);
    const page=req.params.id
    const perPage = 2;
    data = {
      skip: perPage * (page - 1),
      limit: perPage,
    };

    getProductsPerPage(data, (err, products) => {
      console.log('products',products)
      if (err) {
        return res.status(500).json({
          success: 0,
          message: "Database connection errror",
          error: err,
        });
      }
      countProducts((err, count) => {
        if (err) {
          return res.status(500).json({
            success: 0,
            message: "Database connection errror",
            error: err,
          });
        }
        const totalProducts = count;
        const totalPages = Math.ceil(totalProducts / perPage);
        let fromPage, untilPage;
        fromPage = page === 1 ? 1 : page - 1;
        untilPage = fromPage + 5;
        if (untilPage > totalPages) {
          fromPage = totalPages - 5 < 0 ? 1 : totalPages - 5;
          untilPage = totalPages;
        }
        return res.json({
          success: 1,
          data: products,
          pagination: {
            fromPage,
            untilPage,
            currentPage: page,
            totalPages,
            showingFrom: perPage * (page - 1) + 1,
            showingUntil:
              perPage * page > totalProducts ? totalProducts : perPage * page,
          },
        });
      });
    });
  },
  getProductsByCategoryId: (req, res) => {
    const id = req.params.id;
    getProductsByCategoryId(id, (err, results) => {
      if (err) {
        return res.status(500).json({
          success: 0,
          message: "Database connection errror",
          error: err,
        });
      }
      return res.json({
        success: 1,
        data: results,
      });
    });
  },
  getProductsByCollectionId: (req, res) => {
    const id = req.params.id;
    getProductsByCollectionId(id, (err, results) => {
      if (err) {
        return res.status(500).json({
          success: 0,
          message: "Database connection errror",
          error: err,
        });
      }
      return res.json({
        success: 1,
        data: results,
      });
    });
  },
  getAllVariantsAndItsValues: (req, res) => {
    const id = req.params.id;
    getAllVariantsAndItsValues((err, results) => {
      if (err) {
        return res.status(500).json({
          success: 0,
          message: "Database connection errror",
          error: err,
        });
      }
      return res.json({
        success: 1,
        data: results,
      });
    });
  },
  updateProductById: (req, res) => {
    const body = req.body;
    console.log("body is", body.price);
    console.log("array is", body.variants);
    console.log("bodyyy is", body);
    console.log("array is", body.variants.values);
    const promises = [];
    var insertedId = req.params.id;
    console.log("inserted id", insertedId);
    getProductBySKU(body.sku, body.variants.length==0 ? 0 : 1)
      .then((result) => {
        console.log("kkk");
        promises.push(updateProductById(insertedId, body));

        if (body.variants.length!=0)
          promises.push(
            deleteVariantsByProductId(insertedId).then((result) => {
              const pm = [];

              pm.push(addProductVariants(insertedId, body.combinations));

              // .catch((err) => {
              //   console.log("product not added suuceesfully")
              //   return err;
              if (body.variants) {
                body.variants.forEach((variant) => {
                  if (variant.id == null) {
                    pm.push(
                      addVariant(variant.name).then((varint) => {
                        return addVariantValues(
                          varint.insertId,
                          variant.values
                        );
                      })
                      // .catch((err) => {
                      //   return err;
                      // })
                    );
                  } else {
                    pm.push(
                      searchAndAddVariantValue(variant.id, variant.values)
                    );
                  }
                });
              }
              return Promise.all(pm);
            })
          );
        console.log("in promise", promises);
        Promise.all(promises)
          .then((results) => {
            console.log("first promise");
           console.log(results);
            if (body.variants.length!=0) {
              searchProductVariant(
                results[1][0].insertId,
                results[1][0].affectedRows,
                body.combinations
              )
                .then((result) => {
                  console.log(result);
                  return res.status(200).json({
                    success: 1,
                    message: "Product and its variants updated Successfully",
                    result: result,
                    InsertedId: insertedId,
                  });
                })
                .catch((err) => {
                  return res.status(500).json({
                    success: 0,
                    message: "Didnt updated",
                    error: err,
                  });
                });
            } else {
              return res.status(200).json({
                success: 1,
                message: "Product updated Successfully",
                result: results,
              });
            }
          })
          .catch((error) => {
            return res.status(500).json({
              success: 0,
              message: "Databasee connection errror",
              errror: error,
            });
          });
      })
      .catch((err) => {
        res.json({
          success: 0,
          message: "SKU Should be unique",
          error: err,
        });
      });
  },
  uploadProductImages: (req, res) => {
    uploadProductImages(req.params.id, req.files)
    .then((result)=>
    {
      return res.status(200).json({
        success: 1,
        data: result,
      });
        

    }).catch((err)=>
    {
      return res.status(500).json({
        success: 0,
        message: "database connection error",
        error: err,
      });
    })
  },
  searchProduct: (req, res) => {
    searchProduct(req.query, (err, results) => {
      if (err) {
        return res.status(500).json({
          success: 0,
          message: "Database connection errror",
          error: err,
        });
      }
      return res.json({
        success: 1,
        data: results,
      });
    });
  },
  deleteProductById: (req, res) => {
    const id = req.params.id;
    deleteProductById(id, (err, result) => {
      if (err) {
        return res.json({
          success: 0,
          message: "Database conection error",
          error: err,
        });
      }
      return res.json({
        success: 1,
        message: "product  deleted successfully",
        data: result,
      });
    });
  },
  deleteAllProducts: (req, res) => {
    deleteAllProducts((err, result) => {
      if (err) {
        return res.json({
          success: 0,
          message: "Database conection error",
          error: err,
        });
      }
      return res.json({
        success: 1,
        message: "ALl products updated successfully",
        data: result,
      });
    });
  },
};
