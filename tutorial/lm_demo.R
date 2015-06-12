

##REGRESSION REFRESHER
pop <- read.csv("census.csv")
str(pop)

year1900 <- pop$year -1900
mod <- lm(pop$population ~ year1900)
summary(mod)

plot(year1900, pop$population, ylab="", xlab="", las=1, bty="n",
  ylim=c(200,320), xlim=c(65,115))
abline(coef(mod), col="blue", lwd=2)


##MATRIX MATH
X <- matrix(1:6, ncol=2)

A <- X + X
G <- t(X) %*% X



##SOLVE A MODEL
##read data
epa <- read.csv("vehicles_2015.csv")
dim(epa)
str(epa)

##restrict data to vehicles that have cylinders,
##and those that have 8 or fewer cylinders
hist(epa$fuel_cost)
hist(epa$mpg_combined)
hist(epa$cylinders)

summary(epa$cylinders)
table(epa$cylinders)


cyl <- which(is.na(epa$cylinders) | epa$cylinders > 8 | epa$cylinders == 3 | epa$cylinders == 5)
length(cyl)

gas <- epa[-cyl,]
dim(gas)
summary(gas)


##check correlation matrix of numerics
cor(gas[,7:16])

##check select histograms
hist(gas$fuel_cost)
hist(gas$mpg_combined)
hist(gas$cylinders)

##convert cylinders to categorical
##using 4-cylinder vehicles as reference
cyl_pred <- matrix(0, nrow(gas), 2)
cyl_pred[gas$cylinders == 6, 1] <- 1
cyl_pred[gas$cylinders == 8, 2] <- 1
summary(cyl_pred)

##regression (long form)
##fuel_cost ~ mpg_combined
Y <- matrix(gas$fuel_cost/100, ncol=1)
X <- matrix(cbind(rep(1, nrow(gas)),
				  gas$mpg_combined, 
				  cyl_pred), ncol=4)		  
head(Y)
head(X)

colnames(X) <- c("incpt", "mpg_combined", "cyl_6", "cyl_8")
head(X)

#solve for the vector of betas
V <- solve(t(X) %*% X)
(b <- V %*% t(X) %*% Y)

#find Y-hat and error vectors
H <- X %*% V %*% t(X)
pred <- H %*% Y
str(pred)

error <- Y - pred

summary(Y)
summary(pred)
summary(error)

#plot diagnostics
hist(Y)
hist(pred)
hist(error)

plot(Y, pred)
plot(Y, error, ylim=c(-10,10))
plot(pred, error)
lines(c(5,35), c(0,0), col="blue", lwd=2)

#find R-squared
ssm <- sum((pred - mean(Y))^2)
sse <- sum(error^2)
sst <- sum((Y - mean(Y))^2)
Rsq <- 1 - (sse / sst)


##solve using lm()
options(contrasts=c("contr.treatment", "contr.poly"))
mod <- lm(gas$fuel_cost/100 ~ 
          gas$mpg_combined + factor(gas$cylinders))
summary(mod)
str(mod)

chk <- error - mod$residuals
min(chk)
max(chk)

chk <- pred - mod$fitted.values
min(chk)
max(chk)











